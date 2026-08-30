import { inquirySchema, type InquiryInput } from '@/lib/inquiry-schema';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const NOTIFICATION_ATTEMPTS = 3;

type InquiryRuntime = {
  DB?: D1Database;
  INQUIRY_NOTIFICATION_WEBHOOK_URL?: string;
};

async function inquiryRuntime(): Promise<InquiryRuntime> {
  if (process.env.VERCEL) {
    return {
      INQUIRY_NOTIFICATION_WEBHOOK_URL:
        process.env.INQUIRY_NOTIFICATION_WEBHOOK_URL,
    };
  }

  const workerRuntime = await import('cloudflare:workers');
  return workerRuntime.env;
}

function clientAddress(request: Request) {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

async function rateLimitKey(request: Request, now: number) {
  const bucket = Math.floor(now / RATE_LIMIT_WINDOW_MS);
  const source = new TextEncoder().encode(
    `${clientAddress(request)}:${bucket}:inquiries`,
  );
  const digest = await crypto.subtle.digest('SHA-256', source);
  const hash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  return { key: hash, bucket };
}

async function isRateLimited(db: D1Database, request: Request, now: number) {
  const { key, bucket } = await rateLimitKey(request, now);
  const result = await db
    .prepare(
      `INSERT INTO inquiry_rate_limits (
        key, window_started_at, request_count
      ) VALUES (?, ?, 1)
      ON CONFLICT(key) DO UPDATE SET request_count = request_count + 1
      RETURNING request_count`,
    )
    .bind(key, bucket * RATE_LIMIT_WINDOW_MS)
    .first<{ request_count: number }>();

  if (Math.random() < 0.05) {
    await db
      .prepare('DELETE FROM inquiry_rate_limits WHERE window_started_at < ?')
      .bind(now - 24 * 60 * 60 * 1000)
      .run();
  }

  return (result?.request_count ?? RATE_LIMIT_MAX_REQUESTS + 1) >
    RATE_LIMIT_MAX_REQUESTS;
}

function notificationBody(id: string, createdAt: string, inquiry: InquiryInput) {
  return JSON.stringify({
    event: 'inquiry.created',
    reference: id.slice(0, 8).toUpperCase(),
    createdAt,
    inquiry: {
      name: inquiry.name,
      email: inquiry.email,
      businessName: inquiry.businessName,
      website: inquiry.website || null,
      industry: inquiry.industry,
      projectType: inquiry.projectType,
      primaryGoal: inquiry.primaryGoal,
      timeline: inquiry.timeline,
      budget: inquiry.budget,
      details: inquiry.details,
    },
  });
}

async function deliverNotification(
  notificationUrl: string,
  id: string,
  createdAt: string,
  inquiry: InquiryInput,
) {
  let lastError = 'Notification delivery failed.';

  for (let attempt = 1; attempt <= NOTIFICATION_ATTEMPTS; attempt += 1) {
    try {
      const notification = await fetch(notificationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: notificationBody(id, createdAt, inquiry),
        signal: AbortSignal.timeout(4_000),
      });
      if (notification.ok) {
        return { delivered: true, attempts: attempt, lastError: null };
      }
      lastError = `Notification endpoint returned ${notification.status}.`;
      if (notification.status >= 400 && notification.status < 500) {
        return { delivered: false, attempts: attempt, lastError };
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }

  return {
    delivered: false,
    attempts: NOTIFICATION_ATTEMPTS,
    lastError: lastError.slice(0, 500),
  };
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: 'Please send a valid inquiry.' },
      { status: 400 },
    );
  }

  const payload = inquirySchema.safeParse(json);
  if (!payload.success) {
    return Response.json(
      { ok: false, message: 'Please review the highlighted details.' },
      { status: 400 },
    );
  }

  // Quietly accept bot submissions without touching storage or notifications.
  if (payload.data.companyWebsite) {
    return Response.json({ ok: true });
  }

  try {
    const runtime = await inquiryRuntime();
    const db = runtime.DB;
    if (!db) {
      return Response.json(
        {
          ok: false,
          message:
            'Online inquiry delivery is not configured on this host. Please email nextelevenstudios@gmail.com.',
        },
        { status: 503 },
      );
    }

    const now = Date.now();
    if (await isRateLimited(db, request, now)) {
      return Response.json(
        {
          ok: false,
          message: 'Too many inquiries were sent. Please try again later.',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(RATE_LIMIT_WINDOW_MS / 1000) },
        },
      );
    }

    const id = crypto.randomUUID();
    const createdAt = new Date(now).toISOString();
    const inquiry = payload.data;

    await db
      .prepare(
        `INSERT INTO inquiries (
          id, created_at, name, email, business_name, website, industry,
          project_type, current_presence, primary_goal, timeline, budget,
          details, status, notification_status, notification_attempts
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'pending', 0)`,
      )
      .bind(
        id,
        createdAt,
        inquiry.name,
        inquiry.email,
        inquiry.businessName,
        inquiry.website || null,
        inquiry.industry,
        inquiry.projectType,
        inquiry.currentPresence,
        inquiry.primaryGoal,
        inquiry.timeline,
        inquiry.budget,
        inquiry.details,
      )
      .run();

    const notificationUrl = runtime.INQUIRY_NOTIFICATION_WEBHOOK_URL;
    const delivery = notificationUrl
      ? await deliverNotification(notificationUrl, id, createdAt, inquiry)
      : {
          delivered: false,
          attempts: 0,
          lastError: 'Notification webhook is not configured.',
        };

    await db
      .prepare(
        `UPDATE inquiries
         SET notification_status = ?, notification_attempts = ?,
             notification_last_error = ?
         WHERE id = ?`,
      )
      .bind(
        delivery.delivered ? 'delivered' : 'pending',
        delivery.attempts,
        delivery.lastError,
        id,
      )
      .run();

    const reference = id.slice(0, 8).toUpperCase();
    if (!delivery.delivered) {
      console.error('Inquiry notification remains pending', { reference });
      return Response.json(
        { ok: true, reference, deliveryPending: true },
        { status: 202 },
      );
    }

    return Response.json(
      { ok: true, reference, deliveryPending: false },
      { status: 201 },
    );
  } catch (error) {
    console.error('Unable to save inquiry', error);
    return Response.json(
      {
        ok: false,
        message: 'We could not save your inquiry. Please try again.',
      },
      { status: 500 },
    );
  }
}
