CREATE INDEX `idx_activities_task_created` ON `activities` (`task_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_comments_task_created` ON `comments` (`task_id`,`created_at`);