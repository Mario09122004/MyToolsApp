CREATE TABLE `free_days` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `habit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task` text NOT NULL,
	`description` text,
	`startDate` integer NOT NULL,
	`monday` integer DEFAULT false NOT NULL,
	`tuesday` integer DEFAULT false NOT NULL,
	`wednesday` integer DEFAULT false NOT NULL,
	`thursday` integer DEFAULT false NOT NULL,
	`friday` integer DEFAULT false NOT NULL,
	`saturday` integer DEFAULT false NOT NULL,
	`sunday` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `habit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`habitId` integer NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`day` integer NOT NULL,
	FOREIGN KEY (`habitId`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE cascade
);
