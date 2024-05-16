CREATE TABLE `members` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`username` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
