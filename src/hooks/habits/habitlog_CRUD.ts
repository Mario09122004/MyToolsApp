import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";

export const habitlog_CRUD = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const updateHabitLog = async (
        id: number,
        isCompleted: boolean,
    ) => {
        await drizzleDb.update(schema.habitLogs).set({
            isCompleted: isCompleted,
        }).where(eq(schema.habitLogs.id, id));
    }

    const deleteHabitLog = async (id: number) => {
        await drizzleDb.delete(schema.habitLogs).where(eq(schema.habitLogs.id, id));
    }

    const showAllHabitLogsToday = async () => {
        const todayDay = new Date().getDay();
        const query = await drizzleDb
            .select({
                id: schema.habitLogs.id,
                habitId: schema.habitLogs.habitId,
                isCompleted: schema.habitLogs.isCompleted,
                day: schema.habitLogs.day,
                task: schema.habit.task,
                description: schema.habit.description,
            })
            .from(schema.habitLogs)
            .innerJoin(schema.habit, eq(schema.habitLogs.habitId, schema.habit.id))
            .where(eq(schema.habitLogs.day, todayDay));
        return query;
    }

    const showAllHabitLogs = async () => {
        const query = await drizzleDb.query.habitLogs.findMany();
        return query;
    }

    return {
        updateHabitLog,
        deleteHabitLog,
        showAllHabitLogsToday,
        showAllHabitLogs,
    }
};