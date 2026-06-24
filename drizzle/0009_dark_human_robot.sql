CREATE TABLE `project` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`dueday` integer NOT NULL
);
--> statement-breakpoint
DROP TABLE `proyect`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_phases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectId` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`completed` integer DEFAULT false NOT NULL,
	`dueday` integer NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_phases`("id", "projectId", "name", "description", "completed", "dueday", "order") SELECT "id", "projectId", "name", "description", "completed", "dueday", "order" FROM `phases`;--> statement-breakpoint
DROP TABLE `phases`;--> statement-breakpoint
ALTER TABLE `__new_phases` RENAME TO `phases`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `taskPerPhase` ADD `dueday` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `taskPerPhase` ADD `order` integer NOT NULL;