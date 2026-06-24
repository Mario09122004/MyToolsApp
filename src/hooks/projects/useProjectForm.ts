import { useState } from 'react';

export interface ProjectFormState {
    name: string;
    description: string;
    dueday: Date;
}

const defaultState: ProjectFormState = {
    name: '',
    description: '',
    dueday: new Date()
};

export const useProjectForm = (initialValues: ProjectFormState = defaultState) => {
    const [form, setForm] = useState<ProjectFormState>(initialValues);

    const setName = (name: string) => setForm(prev => ({ ...prev, name }));
    const setDescription = (description: string) => setForm(prev => ({ ...prev, description }));
    const setDueday = (dueday: Date) => setForm(prev => ({ ...prev, dueday }));
    const reset = (customValues?: ProjectFormState) => setForm(customValues || defaultState);

    return {
        form,
        setForm,
        setName,
        setDescription,
        setDueday,
        reset
    };
};
