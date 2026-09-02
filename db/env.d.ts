declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    INQUIRY_NOTIFICATION_WEBHOOK_URL?: string;
    OPENAI_API_KEY?: string;
    OPENAI_ASSISTANT_MODEL?: string;
  }
}
