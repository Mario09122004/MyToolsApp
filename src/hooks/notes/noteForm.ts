import { NoteForm } from "@/src/types/Notes/NoteForm";
import { useState } from "react";

export const useNoteForm = () => {
    const [noteForm, setNoteForm] = useState<NoteForm>({
        tittle: '',
        content: '',
    });

    const handleSetTittle = (tittle: string) => {
        setNoteForm(prev => ({ ...prev, tittle }));
    }

    const handleSetContent = (content: string | null) => {
        setNoteForm(prev => ({ ...prev, content }));
    }

    const handleSetNewForm = () => {
        setNoteForm({ tittle: '', content: '' });
    }

    return { noteForm, handleSetContent, handleSetTittle, handleSetNewForm }
}