import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
  },
  (table) => [
    index('idx_inquiries_created_at').on(table.createdAt),
    index('idx_inquiries_status_created_at').on(table.status, table.createdAt),
  ],
);
