CREATE TABLE `task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`completed` integer DEFAULT false NOT NULL,
	`dueday` integer NOT NULL
);
