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

export const orders = sqliteTable('orders', {
    id: integer().primaryKey({ autoIncrement: true }),
    productId: integer().notNull().references(() => products.id, { onDelete: 'cascade' }),
    customerName: text().notNull(),
    quantity: real().notNull(),
    dueDate: text(),
});

export const habit = sqliteTable('habit', {
    id: integer().primaryKey({ autoIncrement: true }),
    task: text().notNull(),
    description: text(),
    startDate: integer().notNull(),
    monday: integer("monday", { mode: "boolean" }).notNull().default(false),
    tuesday: integer("tuesday", { mode: "boolean" }).notNull().default(false),
    wednesday: integer("wednesday", { mode: "boolean" }).notNull().default(false),
    thursday: integer("thursday", { mode: "boolean" }).notNull().default(false),
    friday: integer("friday", { mode: "boolean" }).notNull().default(false),
    saturday: integer("saturday", { mode: "boolean" }).notNull().default(false),
    sunday: integer("sunday", { mode: "boolean" }).notNull().default(false),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const habitLogs = sqliteTable('habit_logs', {
    id: integer().primaryKey({ autoIncrement: true }),
    habitId: integer().notNull().references(() => habit.id, { onDelete: 'cascade' }),
    isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
    day: integer().notNull(),
});

export const loan = sqliteTable('loan', {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
});

export const loanPayments = sqliteTable('loan_payments', {
    id: integer().primaryKey({ autoIncrement: true }),
    loanId: integer().notNull().references(() => loan.id, { onDelete: 'cascade' }),
    amount: real().notNull(),
    reason: text(),
    date: integer().notNull(),
});

export const project = sqliteTable('project', {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    dueday: integer().notNull(),
});

export const phases = sqliteTable('phases', {
    id: integer().primaryKey({ autoIncrement: true }),
    projectId: integer().notNull().references(() => project.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    description: text(),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    dueday: integer().notNull(),
    order: integer().notNull(),
});

export const taskPerPhase = sqliteTable('taskPerPhase', {
    id: integer().primaryKey({ autoIncrement: true }),
    phaseId: integer().notNull().references(() => phases.id, { onDelete: 'cascade' }),
    taskName: text().notNull(),
    description: text(),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    dueday: integer().notNull(),
    order: integer().notNull(),
});

/*
export const freeDays = sqliteTable('free_days', {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    date: text().notNull(),
});*/

// Export Task to use as an interface in your app
export type Task = typeof tasks.$inferSelect;

export type Birthday = typeof birthdays.$inferSelect;

export type Product = typeof products.$inferSelect;

export type Ingredient = typeof ingredients.$inferSelect;

export type Order = typeof orders.$inferSelect;

export type Habit = typeof habit.$inferSelect;

export type HabitLog = typeof habitLogs.$inferSelect;

export type Loan = typeof loan.$inferSelect;

export type LoanPayment = typeof loanPayments.$inferSelect;

export type Project = typeof project.$inferSelect;

export type Phase = typeof phases.$inferSelect;

export type TaskPerPhase = typeof taskPerPhase.$inferSelect;
//export type FreeDay = typeof freeDays.$inferSelect;