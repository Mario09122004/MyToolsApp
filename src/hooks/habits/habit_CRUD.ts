import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from '@/db/schema';
import { eq, and } from "drizzle-orm";

export const useHabitCRUD = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    //Create Habit
    const createHabit = async (
        task: string,
        description: string,
        monday: boolean,
        tuesday: boolean,
        wednesday: boolean,
        thursday: boolean,
        friday: boolean,
        saturday: boolean,
        sunday: boolean,
    ) => {
        const result = await drizzleDb.insert(schema.habit).values({
            task: task,
            description: description,
            startDate: new Date().getTime(),
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday,
            friday: friday,
            saturday: saturday,
            sunday: sunday,
        }).returning({ insertedId: schema.habit.id });

        const insertedId = result[0]?.insertedId;

        if (insertedId) {
            // Check if today is scheduled and insert a log for today if so
            const today = new Date();
            const dayOfWeek = today.getDay();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = days[dayOfWeek];

            let isScheduledForToday = false;
            if (dayName === "Monday" && monday) isScheduledForToday = true;
            else if (dayName === "Tuesday" && tuesday) isScheduledForToday = true;
            else if (dayName === "Wednesday" && wednesday) isScheduledForToday = true;
            else if (dayName === "Thursday" && thursday) isScheduledForToday = true;
            else if (dayName === "Friday" && friday) isScheduledForToday = true;
            else if (dayName === "Saturday" && saturday) isScheduledForToday = true;
            else if (dayName === "Sunday" && sunday) isScheduledForToday = true;

            if (isScheduledForToday) {
                const todayMidnight = new Date();
                todayMidnight.setHours(0, 0, 0, 0);
                const todayTimestamp = todayMidnight.getTime();

                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: insertedId,
                    isCompleted: false,
                    day: todayTimestamp,
                });
            }
        }
    }

    //Update Habit
    const updateHabit = async (
        id: number,
        task: string,
        description: string,
        monday: boolean,
        tuesday: boolean,
        wednesday: boolean,
        thursday: boolean,
        friday: boolean,
        saturday: boolean,
        sunday: boolean,
    ) => {
        await drizzleDb.update(schema.habit).set({
            task: task,
            description: description,
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday,
            friday: friday,
            saturday: saturday,
            sunday: sunday,
        }).where(eq(schema.habit.id, id));

        // Sync today's log
        const today = new Date();
        const dayOfWeek = today.getDay();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[dayOfWeek];

        let isScheduledForToday = false;
        if (dayName === "Monday" && monday) isScheduledForToday = true;
        else if (dayName === "Tuesday" && tuesday) isScheduledForToday = true;
        else if (dayName === "Wednesday" && wednesday) isScheduledForToday = true;
        else if (dayName === "Thursday" && thursday) isScheduledForToday = true;
        else if (dayName === "Friday" && friday) isScheduledForToday = true;
        else if (dayName === "Saturday" && saturday) isScheduledForToday = true;
        else if (dayName === "Sunday" && sunday) isScheduledForToday = true;

        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const todayTimestamp = todayMidnight.getTime();

        if (isScheduledForToday) {
            // Check if log already exists
            const existing = await drizzleDb
                .select()
                .from(schema.habitLogs)
                .where(and(
                    eq(schema.habitLogs.habitId, id),
                    eq(schema.habitLogs.day, todayTimestamp)
                ));

            if (existing.length === 0) {
                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: id,
                    isCompleted: false,
                    day: todayTimestamp,
                });
            }
        } else {
            // Delete today's log if it exists since it's no longer scheduled for today
            await drizzleDb
                .delete(schema.habitLogs)
                .where(and(
                    eq(schema.habitLogs.habitId, id),
                    eq(schema.habitLogs.day, todayTimestamp)
                ));
        }
    }

    //Delete habit
    const deleteHabit = async (id: number) => {
        await drizzleDb.delete(schema.habit).where(eq(schema.habit.id, id));
    }

    //Show habit
    const showAllHabits = async () => {
        const query = await drizzleDb.query.habit.findMany();
        return query;
    }

    return {
        createHabit,
        updateHabit,
        deleteHabit,
        showAllHabits,
    }
};