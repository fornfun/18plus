import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const videos = sqliteTable('videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug'),
  title: text('title'),
  description: text('description'),
  poster: text('poster'),
  video_url: text('video_url'),
  tera_id: text('tera_id').unique().notNull(),
  category: text('category'),
  tags: text('tags'), // JSON string
  duration: text('duration'),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  dislikes: integer('dislikes').default(0),
  comments: integer('comments').default(0),
  published: integer('published', { mode: 'boolean' }).default(false),
  published_at: text('published_at'),
  authorId: text('authorId'),
  user: text('user'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
