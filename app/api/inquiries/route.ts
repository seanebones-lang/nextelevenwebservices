import { env } from 'cloudflare:workers';
import { inquirySchema } from '@/lib/inquiry-schema';

export async function POST(request: Request) {
  try {
    const payload = inquirySchema.safeParse(await request.json());

    if (!payload.success) {
      return Response.json(
        { ok: false, message: 'Please review the highlighted details.' },
        { status: 400 },
      );
    }

    if (payload.data.companyWebsite) {
      return Response.json({ ok: true });
    }

    const db = env.DB;
    if (!db) {
      throw new Error('Inquiry database is unavailable.');
    }

    await db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY NOT NULL,
        created_at TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        business_name TEXT NOT NULL,
        website TEXT,
        industry TEXT NOT NULL,
        project_type TEXT NOT NULL,
        current_presence TEXT NOT NULL,
        primary_goal TEXT NOT NULL,
        timeline TEXT NOT NULL,
        budget TEXT NOT NULL,
        details TEXT NOT NULL,
        status TEXT DEFAULT 'new' NOT NULL
      )`),
      db.prepare(
        'CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at)',
      ),
      db.prepare(
        'CREATE INDEX IF NOT EXISTS idx_inquiries_status_created_at ON inquiries (status, created_at)',
      ),
      db.prepare('PRAGMA optimize'),
    ]);

    const id = crypto.randomUUID();
    const inquiry = payload.data;

    await db
      .prepare(
        `INSERT INTO inquiries (
        id, created_at, name, email, business_name, website, industry,
        project_type, current_presence, primary_goal, timeline, budget, details, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      )
      .bind(
        id,
        new Date().toISOString(),
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

    return Response.json(
      { ok: true, reference: id.slice(0, 8).toUpperCase() },
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
