import { NoteForm } from "@/src/types/Notes/NoteForm";
import { useState } from "react";

export const useNoteForm = () => {
    const [noteForm, setNoteForm] = useState<NoteForm>({
        tittle: '',
        content: '',
    });

    const handleSetTittle = async (tittle: string) => {
        await setNoteForm({ ...noteForm, tittle });
    }

    const handleSetContent = async (content: string | null) => {
        await setNoteForm({ ...noteForm, content });
    }

    const handleSetNewForm = () => {
        setNoteForm({ tittle: '', content: '' });
    }

    return { noteForm, handleSetContent, handleSetTittle, handleSetNewForm }
}