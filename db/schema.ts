import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
    id: integer().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    content: text(),
    date: integer().notNull(),
});

// Export Task to use as an interface in your app
export type Task = typeof tasks.$inferSelect;