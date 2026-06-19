import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";

export const useInitHabits = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const initHabits = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        const todayDay = new Date().getDay();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[todayDay];

        const queryHabitsToday = await drizzleDb.select().from(schema.habitLogs).where(eq(schema.habitLogs.day, todayTimestamp));

        if (queryHabitsToday.length > 0) {
            console.log("ya hay habits para hoy");
            return;
        }

        const queryHabits = await drizzleDb.select().from(schema.habit).where(eq(schema.habit.active, true));

        console.log("Create habits");

        for (let i = 0; i < queryHabits.length; i++) {
            const habit = queryHabits[i];
            let shouldInsert = false;

            if (dayName === "Monday" && habit.monday) shouldInsert = true;
            else if (dayName === "Tuesday" && habit.tuesday) shouldInsert = true;
            else if (dayName === "Wednesday" && habit.wednesday) shouldInsert = true;
            else if (dayName === "Thursday" && habit.thursday) shouldInsert = true;
            else if (dayName === "Friday" && habit.friday) shouldInsert = true;
            else if (dayName === "Saturday" && habit.saturday) shouldInsert = true;
            else if (dayName === "Sunday" && habit.sunday) shouldInsert = true;

            if (shouldInsert) {
                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: habit.id,
                    isCompleted: false,
                    day: todayTimestamp,
                });
            }
        }
    };

    return { initHabits };
};