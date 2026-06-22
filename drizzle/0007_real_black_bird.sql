CREATE TABLE `loan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `loan_payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`loanId` integer NOT NULL,
	`amount` real NOT NULL,
	`reason` text,
	`date` integer NOT NULL,
	FOREIGN KEY (`loanId`) REFERENCES `loan`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `free_days`;