import React, { useEffect, useState } from 'react';
import {
    FormControl,
    FormControlLabel,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
    FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText } from '@/components/ui/button';
import { AlertCircleIcon } from '@/components/ui/icon';
import DatePicker from 'react-native-date-picker';
import { useTaskForm } from '@/src/hooks/projects/useTaskForm';
import { useCRUDProjects } from '@/src/hooks/projects/useCRUDProjects';

interface TaskFormProps {
    editMode: boolean;
    phaseId: number;
    taskId?: number;
    initialValues?: {
        taskName: string;
        description: string;
        dueday: number;
    };
    onSave: () => void;
    onClose: () => void;
}

export const TaskForm = ({
    editMode,
    phaseId,
    taskId = 0,
    initialValues,
    onSave,
    onClose,
}: TaskFormProps) => {
    const { form, setForm, setTaskName, setDescription, setDueday, reset } = useTaskForm();
    const { insertTask, updateTask } = useCRUDProjects();
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (editMode && initialValues) {
            setForm({
                taskName: initialValues.taskName,
                description: initialValues.description,
                dueday: new Date(initialValues.dueday),
            });
        } else {
            reset();
        }
    }, [editMode, taskId, initialValues]);

    const handleSave = async () => {
        if (!form.taskName.trim()) {
            setIsError(true);
            return;
        }
        setIsError(false);

        try {
            if (editMode && taskId > 0) {
                await updateTask(
                    taskId,
                    form.taskName,
                    form.description || null,
                    initialValues?.taskName ? false : false, // In edit mode, we preserve completion or reset it if needed. Let's make it more flexible or pass from parent.
                    form.dueday.getTime()
                );
            } else {
                await insertTask(
                    phaseId,
                    form.taskName,
                    form.description || null,
                    form.dueday.getTime()
                );
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };

    return (
        <FormControl size="md" isInvalid={isError}>
            <FormControlLabel>
                <FormControlLabelText>Task Name</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    placeholder="Enter task name"
                    value={form.taskName}
                    onChangeText={(text) => {
                        setTaskName(text);
                        if (isError && text.trim()) setIsError(false);
                    }}
                    className="text-typography-900"
                />
            </Input>

            <FormControlLabel className="mt-3">
                <FormControlLabelText>Description</FormControlLabelText>
            </FormControlLabel>
            <Textarea size="md" className="my-1">
                <TextareaInput
                    placeholder="Enter task description (optional)"
                    value={form.description}
                    onChangeText={setDescription}
                    className="text-typography-900"
                />
            </Textarea>


            {isError && (
                <FormControlError className="mt-2">
                    <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                    <FormControlErrorText className="text-red-500">
                        Please enter a valid task name.
                    </FormControlErrorText>
                </FormControlError>
            )}

            <Button
                onPress={handleSave}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-500 mt-5 border-none"
            >
                <ButtonText className="text-white font-bold">Save Task</ButtonText>
            </Button>
        </FormControl>
    );
};
