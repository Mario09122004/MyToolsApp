import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";

export const initHabits = async () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const today = new Date();
    const todayDay = today.getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date().getDay()];


    const queryHabitsToday = await drizzleDb.select().from(schema.habitLogs).where(eq(schema.habitLogs.day, todayDay));

    if(queryHabitsToday.length > 0) {
        console.log("ya hay habits para hoy");
        return;
    }

    const queryHabits = await drizzleDb.select().from(schema.habit).where(eq(schema.habit.active, true));

    console.log("Create habits");

    for (let i = 0; i < queryHabits.length; i++) {
        console.log(queryHabits[i]);
        if (dayName === "Monday") {
            if(queryHabits[i].monday){
                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: queryHabits[i].id,
                    isCompleted: false,
                    day: todayDay,
                });
            }
        }
        if (dayName === "Tuesday") {
            if(queryHabits[i].tuesday){
                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: queryHabits[i].id,
                    isCompleted: false,
                    day: todayDay,
                });
            }
        }
        if (dayName === "Wednesday") {
            if(queryHabits[i].wednesday){
                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: queryHabits[i].id,
                    isCompleted: false,
                    day: todayDay,
                });
            }
        }
        if (dayName === "Thursday") {
            if(queryHabits[i].thursday){
                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: queryHabits[i].id,
                    isCompleted: false,
                    day: todayDay,
                });
            }
        }
        if (dayName === "Friday") {
            if(queryHabits[i].friday){
                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: queryHabits[i].id,
                    isCompleted: false,
                    day: todayDay,
                });
            }
        }
        if (dayName === "Saturday") {
            if(queryHabits[i].saturday){
                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: queryHabits[i].id,
                    isCompleted: false,
                    day: todayDay,
                });
            }
        }
        if (dayName === "Sunday") {
            if(queryHabits[i].sunday){
                await drizzleDb.insert(schema.habitLogs).values({
                    habitId: queryHabits[i].id,
                    isCompleted: false,
                    day: todayDay,
                });
            }
        }
    }

};