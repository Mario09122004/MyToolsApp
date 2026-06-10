CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer NOT NULL,
	`name` text NOT NULL,
	`quantity` real NOT NULL,
	`unit` text NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`pricePerUnit` real DEFAULT 0 NOT NULL,
	`yieldAmount` real DEFAULT 1 NOT NULL,
	`yieldUnit` text DEFAULT 'units' NOT NULL,
	`subYieldAmount` real,
	`subYieldUnit` text
);
