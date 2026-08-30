CREATE TABLE `inquiry_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`window_started_at` integer NOT NULL,
	`request_count` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `notification_status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `notification_attempts` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `notification_last_error` text;