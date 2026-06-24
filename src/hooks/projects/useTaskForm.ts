import { useState } from 'react';

export interface TaskFormState {
    taskName: string;
    description: string;
    dueday: Date;
}

const defaultState: TaskFormState = {
    taskName: '',
    description: '',
    dueday: new Date()
};

export const useTaskForm = (initialValues: TaskFormState = defaultState) => {
    const [form, setForm] = useState<TaskFormState>(initialValues);

    const setTaskName = (taskName: string) => setForm(prev => ({ ...prev, taskName }));
    const setDescription = (description: string) => setForm(prev => ({ ...prev, description }));
    const setDueday = (dueday: Date) => setForm(prev => ({ ...prev, dueday }));
    const reset = (customValues?: TaskFormState) => setForm(customValues || defaultState);

    return {
        form,
        setForm,
        setTaskName,
        setDescription,
        setDueday,
        reset
    };
};
