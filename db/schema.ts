import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
    id: integer().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    content: text(),
    date: integer().notNull(),
});

export const birthdays = sqliteTable('birthdays', {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    date: integer().notNull(),
});

export const products = sqliteTable('products', {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    pricePerUnit: real().notNull().default(0),
    yieldAmount: real().notNull().default(1),
    yieldUnit: text().notNull().default('units'),
    subYieldAmount: real(),
    subYieldUnit: text(),
});

export const ingredients = sqliteTable('ingredients', {
    id: integer().primaryKey({ autoIncrement: true }),
    productId: integer().notNull().references(() => products.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    quantity: real().notNull(),
    unit: text().notNull(),
    price: real(),
});

// Export Task to use as an interface in your app
export type Task = typeof tasks.$inferSelect;

export type Birthday = typeof birthdays.$inferSelect;

export type Product = typeof products.$inferSelect;

export type Ingredient = typeof ingredients.$inferSelect;

export const orders = sqliteTable('orders', {
    id: integer().primaryKey({ autoIncrement: true }),
    productId: integer().notNull().references(() => products.id, { onDelete: 'cascade' }),
    customerName: text().notNull(),
    quantity: real().notNull(),
    dueDate: text(), // Optional delivery date
});

export type Order = typeof orders.$inferSelect;