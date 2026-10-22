CREATE TABLE `medical_files` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`visit_id` text DEFAULT '' NOT NULL,
	`title` text NOT NULL,
	`file_name` text NOT NULL,
	`mime` text NOT NULL,
	`bytes` integer NOT NULL,
	`kind` text NOT NULL,
	`added_by` text NOT NULL,
	`created_at` text NOT NULL
);
