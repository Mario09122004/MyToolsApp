CREATE TABLE `phases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`proyectId` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`completed` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`proyectId`) REFERENCES `proyect`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `proyect` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `taskPerPhase` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phaseId` integer NOT NULL,
	`taskName` text NOT NULL,
	`description` text,
	`completed` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`phaseId`) REFERENCES `phases`(`id`) ON UPDATE no action ON DELETE cascade
);
