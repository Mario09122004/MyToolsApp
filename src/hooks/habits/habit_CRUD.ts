import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";

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
        await drizzleDb.insert(schema.habit).values({
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
        });
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