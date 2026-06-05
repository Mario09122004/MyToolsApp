import {
    FormControl,
    FormControlLabel,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
    FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { AlertCircleIcon } from '@/components/ui/icon';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { useBirthdayForm } from '@/src/hooks/birthdays/birthdayForm';
import { useCRUDBirthdays } from '@/src/hooks/birthdays/birthdayAdd';

export const FormBirthday = ({ 
    editMode, 
    idBirthday = 0, 
    onSave,
    onClose
}: { 
    editMode: boolean; 
    idBirthday?: number; 
    onSave?: () => void;
    onClose?: () => void;
}) => {
    const { birthdayForm, handleSetName, handleSetDate, handleSetNewForm, setBirthdayForm } = useBirthdayForm();
    const { insertBirthday, queryBirthdayById, updateBirthday } = useCRUDBirthdays();
    const [birthdayIdEdit, setBirthdayIdEdit] = useState(idBirthday);
    const [editModeBirthday, setEditModeBirthday] = useState(editMode);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setBirthdayIdEdit(idBirthday);
        setEditModeBirthday(editMode);
    }, [idBirthday, editMode]);

    useEffect(() => {
        if (!editModeBirthday) {
            handleSetNewForm();
        } else {
            const loadBirthdayData = async () => {
                if (birthdayIdEdit > 0) {
                    const res = await queryBirthdayById(birthdayIdEdit);
                    if (res && res.length > 0) {
                        setBirthdayForm({
                            name: res[0].name,
                            date: new Date(res[0].date),
                        });
                    }
                }
            };
            loadBirthdayData();
        }
    }, [editModeBirthday, birthdayIdEdit]);

    const handleSave = async () => {
        if (!birthdayForm.name.trim()) {
            setIsError(true);
            return;
        }
        setIsError(false);
        try {
            if (editModeBirthday) {
                await updateBirthday(birthdayIdEdit, birthdayForm.name, birthdayForm.date.getTime());
            } else {
                await insertBirthday(birthdayForm.name, birthdayForm.date.getTime());
            }
            if (onSave) onSave();
            if (onClose) onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <FormControl size="md" isInvalid={isError}>
            <FormControlLabel>
                <FormControlLabelText>Name</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    placeholder="Enter Name"
                    value={birthdayForm.name}
                    onChangeText={(text) => {
                        handleSetName(text);
                        if (isError && text.trim()) setIsError(false);
                    }}
                />
            </Input>

            <FormControlLabel className="mt-4">
                <FormControlLabelText>Birth Date</FormControlLabelText>
            </FormControlLabel>
            <Button 
                onPress={() => setDatePickerOpen(true)} 
                variant="outline" 
                action="secondary" 
                className="my-1 justify-start"
            >
                <ButtonText className="text-left font-normal text-typography-900">
                    {birthdayForm.date.toLocaleDateString() === new Date().toLocaleDateString() 
                        ? "Select Date" 
                        : birthdayForm.date.toLocaleDateString()}
                </ButtonText>
            </Button>

            <DatePicker
                modal
                open={datePickerOpen}
                date={birthdayForm.date}
                mode="date"
                onConfirm={(selectedDate) => {
                    setDatePickerOpen(false);
                    handleSetDate(selectedDate);
                }}
                onCancel={() => {
                    setDatePickerOpen(false);
                }}
            />

            {isError && (
                <FormControlError className="mt-2">
                    <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                    <FormControlErrorText className="text-red-500">
                        Please enter a valid name.
                    </FormControlErrorText>
                </FormControlError>
            )}

            <Button
                onPress={handleSave}
                className="bg-green-500 mt-5"
            >
                <ButtonText className="text-black dark:text-white font-bold">Save</ButtonText>
            </Button>
        </FormControl>
    );
};
