import { BirthdayForm } from "@/src/types/Birthday/BirthdayForm";
import { useState } from "react";

export const useBirthdayForm = () => {
    const [birthdayForm, setBirthdayForm] = useState<BirthdayForm>({
        name: '',
        date: new Date(),
    });

    const handleSetName = (name: string) => {
        setBirthdayForm(prev => ({ ...prev, name }));
    };

    const handleSetDate = (date: Date) => {
        setBirthdayForm(prev => ({ ...prev, date }));
    };

    const handleSetNewForm = () => {
        setBirthdayForm({ name: '', date: new Date() });
    };

    return { birthdayForm, handleSetName, handleSetDate, handleSetNewForm, setBirthdayForm };
};
