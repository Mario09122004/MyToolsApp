import { useState } from 'react';

export interface PhaseFormState {
    name: string;
    description: string;
    dueday: Date;
}

const defaultState: PhaseFormState = {
    name: '',
    description: '',
    dueday: new Date()
};

export const usePhaseForm = (initialValues: PhaseFormState = defaultState) => {
    const [form, setForm] = useState<PhaseFormState>(initialValues);

    const setName = (name: string) => setForm(prev => ({ ...prev, name }));
    const setDescription = (description: string) => setForm(prev => ({ ...prev, description }));
    const setDueday = (dueday: Date) => setForm(prev => ({ ...prev, dueday }));
    const reset = (customValues?: PhaseFormState) => setForm(customValues || defaultState);

    return {
        form,
        setForm,
        setName,
        setDescription,
        setDueday,
        reset
    };
};
