CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`business_name` text NOT NULL,
	`website` text,
	`industry` text NOT NULL,
	`project_type` text NOT NULL,
	`current_presence` text NOT NULL,
	`primary_goal` text NOT NULL,
	`timeline` text NOT NULL,
	`budget` text NOT NULL,
	`details` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_inquiries_created_at` ON `inquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_inquiries_status_created_at` ON `inquiries` (`status`,`created_at`);