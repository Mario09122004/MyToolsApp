import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";

export const useCRUDNotes = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const queryNotes = async () => await drizzleDb.select().from(schema.tasks);

    const queryNotesById = async (id: number) => await drizzleDb.select().from(schema.tasks).where(eq(schema.tasks.id, id));

    const insertNote = async (
        tittle: string = "",
        content: string = ""
    ) => drizzleDb.insert(
        schema.tasks
    ).values({
        title: tittle,
        content: content,
        date: Date.now(),
    });

    const deleteNote = async (
        id: number = 0
    ) => await drizzleDb.delete(
        schema.tasks
    ).where(
        eq(schema.tasks.id, id)
    );

    const updateNote = async (
        tittle: string = "",
        content: string = "",
        id: number = 0
    ) => await drizzleDb.update(
        schema.tasks
    ).set({
        title: tittle,
        content: content,
    }).where(
        eq(schema.tasks.id, id)
    );


    return { queryNotes, insertNote, deleteNote, updateNote, queryNotesById }
}
