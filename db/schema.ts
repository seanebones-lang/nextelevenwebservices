import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const inquiries = sqliteTable(
  'inquiries',
  {
    id: text('id').primaryKey(),
    createdAt: text('created_at').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    businessName: text('business_name').notNull(),
    website: text('website'),
    industry: text('industry').notNull(),
    projectType: text('project_type').notNull(),
    currentPresence: text('current_presence').notNull(),
    primaryGoal: text('primary_goal').notNull(),
    timeline: text('timeline').notNull(),
    budget: text('budget').notNull(),
    details: text('details').notNull(),
    status: text('status').notNull().default('new'),
    notificationStatus: text('notification_status')
      .notNull()
      .default('pending'),
    notificationAttempts: integer('notification_attempts').notNull().default(0),
    notificationLastError: text('notification_last_error'),
  },
  (table) => [
    index('idx_inquiries_created_at').on(table.createdAt),
    index('idx_inquiries_status_created_at').on(table.status, table.createdAt),
  ],
);

export const inquiryRateLimits = sqliteTable('inquiry_rate_limits', {
  key: text('key').primaryKey(),
  windowStartedAt: integer('window_started_at').notNull(),
  requestCount: integer('request_count').notNull().default(1),
});
