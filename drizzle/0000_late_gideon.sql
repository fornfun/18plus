CREATE TABLE `videos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text,
	`title` text,
	`description` text,
	`poster` text,
	`video_url` text,
	`tera_id` text NOT NULL,
	`category` text,
	`tags` text,
	`duration` text,
	`views` integer DEFAULT 0,
	`likes` integer DEFAULT 0,
	`dislikes` integer DEFAULT 0,
	`comments` integer DEFAULT 0,
	`published` integer DEFAULT false,
	`published_at` text,
	`authorId` text,
	`user` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `videos_tera_id_unique` ON `videos` (`tera_id`);