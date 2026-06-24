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
import { useProjectForm } from '@/src/hooks/projects/useProjectForm';
import { useCRUDProjects } from '@/src/hooks/projects/useCRUDProjects';

interface ProjectFormProps {
    editMode: boolean;
    projectId?: number;
    initialValues?: {
        name: string;
        description: string;
        dueday: number;
    };
    onSave: () => void;
    onClose: () => void;
}

export const ProjectForm = ({
    editMode,
    projectId = 0,
    initialValues,
    onSave,
    onClose,
}: ProjectFormProps) => {
    const { form, setForm, setName, setDescription, setDueday, reset } = useProjectForm();
    const { insertProject, updateProject } = useCRUDProjects();
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (editMode && initialValues) {
            setForm({
                name: initialValues.name,
                description: initialValues.description,
                dueday: new Date(initialValues.dueday),
            });
        } else {
            reset();
        }
    }, [editMode, projectId, initialValues]);

    const handleSave = async () => {
        if (!form.name.trim()) {
            setIsError(true);
            return;
        }
        setIsError(false);

        try {
            if (editMode && projectId > 0) {
                await updateProject(
                    projectId,
                    form.name,
                    form.description || null,
                    form.dueday.getTime()
                );
            } else {
                await insertProject(
                    form.name,
                    form.description || null,
                    form.dueday.getTime()
                );
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };

    return (
        <FormControl size="md" isInvalid={isError}>
            <FormControlLabel>
                <FormControlLabelText>Project Name</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    placeholder="Enter project name"
                    value={form.name}
                    onChangeText={(text) => {
                        setName(text);
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
                    placeholder="Enter project description (optional)"
                    value={form.description}
                    onChangeText={setDescription}
                    className="text-typography-900"
                />
            </Textarea>


            {isError && (
                <FormControlError className="mt-2">
                    <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                    <FormControlErrorText className="text-red-500">
                        Please enter a valid project name.
                    </FormControlErrorText>
                </FormControlError>
            )}

            <Button
                onPress={handleSave}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-500 mt-5 border-none"
            >
                <ButtonText className="text-white font-bold">Save Project</ButtonText>
            </Button>
        </FormControl>
    );
};
