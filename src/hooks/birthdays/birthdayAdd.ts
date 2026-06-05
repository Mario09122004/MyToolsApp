import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";

export const useCRUDBirthdays = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const queryBirthdays = async () => await drizzleDb.select().from(schema.birthdays);

    const queryBirthdayById = async (id: number) => 
        await drizzleDb.select().from(schema.birthdays).where(eq(schema.birthdays.id, id));

    const insertBirthday = async (
        name: string = "",
        date: number = Date.now()
    ) => drizzleDb.insert(
        schema.birthdays
    ).values({
        name: name,
        date: date,
    });

    const deleteBirthday = async (
        id: number = 0
    ) => await drizzleDb.delete(
        schema.birthdays
    ).where(
        eq(schema.birthdays.id, id)
    );

    const updateBirthday = async (
        id: number = 0,
        name: string = "",
        date: number = Date.now()
    ) => await drizzleDb.update(
        schema.birthdays
    ).set({
        name: name,
        date: date,
    }).where(
        eq(schema.birthdays.id, id)
    );

    return { queryBirthdays, queryBirthdayById, insertBirthday, deleteBirthday, updateBirthday };
};
