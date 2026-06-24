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
import { usePhaseForm } from '@/src/hooks/projects/usePhaseForm';
import { useCRUDProjects } from '@/src/hooks/projects/useCRUDProjects';

interface PhaseFormProps {
    editMode: boolean;
    projectId: number;
    phaseId?: number;
    initialValues?: {
        name: string;
        description: string;
        dueday: number;
    };
    onSave: () => void;
    onClose: () => void;
}

export const PhaseForm = ({
    editMode,
    projectId,
    phaseId = 0,
    initialValues,
    onSave,
    onClose,
}: PhaseFormProps) => {
    const { form, setForm, setName, setDescription, setDueday, reset } = usePhaseForm();
    const { insertPhase, updatePhase } = useCRUDProjects();
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
    }, [editMode, phaseId, initialValues]);

    const handleSave = async () => {
        if (!form.name.trim()) {
            setIsError(true);
            return;
        }
        setIsError(false);

        try {
            if (editMode && phaseId > 0) {
                await updatePhase(
                    phaseId,
                    form.name,
                    form.description || null,
                    initialValues?.name ? false : false, // In edit mode, we preserve completion or reset it if needed. Let's make it more flexible or pass from parent.
                    form.dueday.getTime()
                );
            } else {
                await insertPhase(
                    projectId,
                    form.name,
                    form.description || null,
                    form.dueday.getTime()
                );
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving phase:", error);
        }
    };

    return (
        <FormControl size="md" isInvalid={isError}>
            <FormControlLabel>
                <FormControlLabelText>Phase Name</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    placeholder="Enter phase name (e.g. Design, Setup)"
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
                    placeholder="Enter phase description (optional)"
                    value={form.description}
                    onChangeText={setDescription}
                    className="text-typography-900"
                />
            </Textarea>


            {isError && (
                <FormControlError className="mt-2">
                    <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                    <FormControlErrorText className="text-red-500">
                        Please enter a valid phase name.
                    </FormControlErrorText>
                </FormControlError>
            )}

            <Button
                onPress={handleSave}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-500 mt-5 border-none"
            >
                <ButtonText className="text-white font-bold">Save Phase</ButtonText>
            </Button>
        </FormControl>
    );
};
