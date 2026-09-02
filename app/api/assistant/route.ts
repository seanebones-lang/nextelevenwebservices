import { PRESENCE_ASSISTANT_INSTRUCTIONS } from '@/lib/presence-assistant-knowledge';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 18;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_BODY_BYTES = 32_000;
const MAX_MEMORY_KEYS = 500;
const UPSTREAM_TIMEOUT_MS = 45_000;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type AssistantRuntime = {
  DB?: D1Database;
  OPENAI_API_KEY?: string;
  OPENAI_ASSISTANT_MODEL?: string;
};

type MemoryBucket = {
  count: number;
  expiresAt: number;
};

const memoryBuckets = new Map<string, MemoryBucket>();

async function assistantRuntime(): Promise<AssistantRuntime> {
  if (process.env.VERCEL) {
    return {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_ASSISTANT_MODEL: process.env.OPENAI_ASSISTANT_MODEL,
    };
  }

  const workerRuntimeSpecifier = 'cloudflare:workers';
  const workerRuntime = await import(workerRuntimeSpecifier);
  return workerRuntime.env;
}

function noStoreHeaders(extra?: Record<string, string>) {
  return {
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    ...extra,
  };
}

function clientAddress(request: Request) {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

async function rateLimitIdentity(request: Request, now: number) {
  const bucket = Math.floor(now / WINDOW_MS);
  const source = new TextEncoder().encode(
    `${clientAddress(request)}:${bucket}:assistant`,
  );
  const digest = await crypto.subtle.digest('SHA-256', source);
  const key = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  return { key, bucket };
}

async function isRateLimited(
  runtime: AssistantRuntime,
  request: Request,
  now: number,
) {
  const { key, bucket } = await rateLimitIdentity(request, now);

  if (runtime.DB) {
    const result = await runtime.DB.prepare(
      `INSERT INTO inquiry_rate_limits (
        key, window_started_at, request_count
      ) VALUES (?, ?, 1)
      ON CONFLICT(key) DO UPDATE SET request_count = request_count + 1
      RETURNING request_count`,
    )
      .bind(key, bucket * WINDOW_MS)
      .first<{ request_count: number }>();

    if (Math.random() < 0.02) {
      await runtime.DB.prepare(
        'DELETE FROM inquiry_rate_limits WHERE window_started_at < ?',
      )
        .bind(now - WINDOW_MS * 2)
        .run()
        .catch(() => undefined);
    }
    return (result?.request_count ?? MAX_REQUESTS + 1) > MAX_REQUESTS;
  }

  if (memoryBuckets.size >= MAX_MEMORY_KEYS) {
    for (const [storedKey, value] of memoryBuckets) {
      if (value.expiresAt <= now) memoryBuckets.delete(storedKey);
    }
    if (memoryBuckets.size >= MAX_MEMORY_KEYS) {
      memoryBuckets.delete(memoryBuckets.keys().next().value ?? '');
    }
  }

  const current = memoryBuckets.get(key);
  if (!current || current.expiresAt <= now) {
    memoryBuckets.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function parseMessages(value: unknown): ChatMessage[] | null {
  if (!value || typeof value !== 'object') return null;
  const messages = (value as { messages?: unknown }).messages;
  if (
    !Array.isArray(messages) ||
    messages.length < 1 ||
    messages.length > MAX_MESSAGES
  ) {
    return null;
  }

  const parsed: ChatMessage[] = [];
  for (const [index, message] of messages.entries()) {
    if (!message || typeof message !== 'object') return null;
    const role = (message as { role?: unknown }).role;
    const content = (message as { content?: unknown }).content;
    if (
      (role !== 'user' && role !== 'assistant') ||
      typeof content !== 'string' ||
      content.trim().length < 1 ||
      content.length > MAX_MESSAGE_LENGTH
    ) {
      return null;
    }

    const expectedRole = index % 2 === 0 ? 'user' : 'assistant';
    if (role !== expectedRole) return null;
    parsed.push({ role, content: content.trim() });
  }

  if (parsed.at(-1)?.role !== 'user') return null;
  return parsed;
}

async function readJsonWithinLimit(request: Request) {
  if (!request.body) {
    return { payload: null, tooLarge: false, invalid: true } as const;
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return { payload: null, tooLarge: true, invalid: false } as const;
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return {
      payload: JSON.parse(new TextDecoder().decode(bytes)) as unknown,
      tooLarge: false,
      invalid: false,
    } as const;
  } catch {
    return { payload: null, tooLarge: false, invalid: true } as const;
  }
}

function normalizedAssistantStream(
  upstream: Response,
  signal: AbortSignal,
  cleanup: () => void,
) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body?.getReader();
  let cancelled = false;

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      if (!reader) {
        controller.enqueue(
          encoder.encode(`${JSON.stringify({ type: 'error' })}\n`),
        );
        controller.close();
        cleanup();
        return;
      }

      let buffer = '';
      let closed = false;
      let terminalSeen = false;
      const enqueue = (event: object) => {
        if (closed || cancelled) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          cancelled = true;
        }
      };
      const close = () => {
        if (closed || cancelled) return;
        closed = true;
        try {
          controller.close();
        } catch {
          cancelled = true;
        }
      };

      const processLine = (line: string) => {
        if (!line.startsWith('data: ')) return;
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const event = JSON.parse(data) as {
            type?: string;
            delta?: string;
          };
          if (
            (event.type === 'response.output_text.delta' ||
              event.type === 'response.refusal.delta') &&
            typeof event.delta === 'string'
          ) {
            enqueue({ type: 'delta', delta: event.delta });
          }
          if (event.type === 'response.completed') {
            terminalSeen = true;
            enqueue({ type: 'done' });
          }
          if (event.type === 'response.incomplete') {
            terminalSeen = true;
            enqueue({ type: 'incomplete' });
          }
          if (event.type === 'error' || event.type === 'response.failed') {
            terminalSeen = true;
            enqueue({ type: 'error' });
          }
        } catch {
          // Ignore upstream keepalive or unrecognized event data.
        }
      };

      const abort = () => {
        cancelled = true;
        void reader.cancel();
      };
      signal.addEventListener('abort', abort, { once: true });

      try {
        while (!signal.aborted) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          lines.forEach(processLine);
        }
        buffer += decoder.decode();
        if (buffer.trim()) processLine(buffer.trimEnd());
        if (!terminalSeen && !signal.aborted && !cancelled) {
          enqueue({ type: 'error' });
        }
      } catch {
        if (!signal.aborted && !cancelled) enqueue({ type: 'error' });
      } finally {
        signal.removeEventListener('abort', abort);
        close();
        cleanup();
      }
    },
    cancel() {
      cancelled = true;
      cleanup();
      void reader?.cancel();
    },
  });
}

export async function GET() {
  try {
    const runtime = await assistantRuntime();
    return Response.json(
      { configured: Boolean(runtime.OPENAI_API_KEY) },
      { headers: noStoreHeaders() },
    );
  } catch {
    return Response.json({ configured: false }, { headers: noStoreHeaders() });
  }
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return Response.json(
      { message: 'That conversation is too large. Start a new chat.' },
      { status: 413, headers: noStoreHeaders() },
    );
  }

  const body = await readJsonWithinLimit(request);
  if (body.tooLarge) {
    return Response.json(
      { message: 'That conversation is too large. Start a new chat.' },
      { status: 413, headers: noStoreHeaders() },
    );
  }
  if (body.invalid) {
    return Response.json(
      { message: 'Please send a valid question.' },
      { status: 400, headers: noStoreHeaders() },
    );
  }

  const messages = parseMessages(body.payload);
  if (!messages) {
    return Response.json(
      { message: 'Please start a new chat and try that question again.' },
      { status: 400, headers: noStoreHeaders() },
    );
  }

  try {
    const runtime = await assistantRuntime();
    if (!runtime.OPENAI_API_KEY) {
      return Response.json(
        {
          message:
            'Live AI is not configured on this host. Guided NextEleven answers are still available.',
          guided: true,
        },
        { status: 503, headers: noStoreHeaders() },
      );
    }

    if (await isRateLimited(runtime, request, Date.now())) {
      return Response.json(
        {
          message:
            'The assistant has reached its short-term limit. Try again later.',
        },
        {
          status: 429,
          headers: noStoreHeaders({ 'Retry-After': String(WINDOW_MS / 1_000) }),
        },
      );
    }

    const upstreamController = new AbortController();
    const abortUpstream = () => upstreamController.abort();
    request.signal.addEventListener('abort', abortUpstream, { once: true });
    const timeout = setTimeout(
      () => upstreamController.abort(),
      UPSTREAM_TIMEOUT_MS,
    );
    const cleanupUpstream = () => {
      clearTimeout(timeout);
      request.signal.removeEventListener('abort', abortUpstream);
    };

    let upstream: Response;
    try {
      upstream = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${runtime.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: runtime.OPENAI_ASSISTANT_MODEL || 'gpt-5.4-mini',
          instructions: PRESENCE_ASSISTANT_INSTRUCTIONS,
          input: messages.map((message) => ({
            role: message.role,
            content: [{ type: 'input_text', text: message.content }],
          })),
          max_output_tokens: 700,
          reasoning: { effort: 'none' },
          store: false,
          stream: true,
          text: { format: { type: 'text' }, verbosity: 'low' },
        }),
        signal: upstreamController.signal,
      });
    } catch (error) {
      cleanupUpstream();
      throw error;
    }

    if (!upstream.ok || !upstream.body) {
      cleanupUpstream();
      await upstream.body?.cancel();
      console.error('Assistant upstream unavailable', {
        requestId: upstream.headers.get('x-request-id') ?? undefined,
        status: upstream.status,
      });
      return Response.json(
        {
          message:
            upstream.status === 429
              ? 'The assistant is at capacity. Please try again shortly.'
              : 'Live AI is temporarily unavailable. Guided answers are still available.',
          guided: true,
        },
        {
          status: upstream.status === 429 ? 429 : 503,
          headers: noStoreHeaders(
            upstream.status === 429 ? { 'Retry-After': '60' } : undefined,
          ),
        },
      );
    }

    return new Response(
      normalizedAssistantStream(
        upstream,
        upstreamController.signal,
        cleanupUpstream,
      ),
      {
        headers: noStoreHeaders({
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'X-Accel-Buffering': 'no',
        }),
      },
    );
  } catch (error) {
    if (request.signal.aborted) {
      return new Response(null, { status: 499, headers: noStoreHeaders() });
    }
    console.error('Assistant request failed', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    return Response.json(
      {
        message:
          'Live AI is temporarily unavailable. Guided answers are still available.',
        guided: true,
      },
      { status: 503, headers: noStoreHeaders() },
    );
  }
}
