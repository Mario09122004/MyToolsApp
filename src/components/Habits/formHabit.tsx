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
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useHabitCRUD } from '@/src/hooks/habits/habit_CRUD';

const DAYS_OF_WEEK = [
    { label: 'M', key: 'monday', fullName: 'Monday' },
    { label: 'T', key: 'tuesday', fullName: 'Tuesday' },
    { label: 'W', key: 'wednesday', fullName: 'Wednesday' },
    { label: 'T', key: 'thursday', fullName: 'Thursday' },
    { label: 'F', key: 'friday', fullName: 'Friday' },
    { label: 'S', key: 'saturday', fullName: 'Saturday' },
    { label: 'S', key: 'sunday', fullName: 'Sunday' },
];

export const FormHabit = ({
    editMode = false,
    idHabit = 0,
    onSave,
    onClose,
}: {
    editMode?: boolean;
    idHabit?: number;
    onSave?: () => void;
    onClose?: () => void;
}) => {
    const { createHabit, updateHabit, showAllHabits } = useHabitCRUD();
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [schedule, setSchedule] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    });
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (editMode && idHabit > 0) {
            const loadHabit = async () => {
                const habitsList = await showAllHabits();
                const habit = habitsList.find((h) => h.id === idHabit);
                if (habit) {
                    setTask(habit.task);
                    setDescription(habit.description ?? '');
                    setSchedule({
                        monday: habit.monday ?? false,
                        tuesday: habit.tuesday ?? false,
                        wednesday: habit.wednesday ?? false,
                        thursday: habit.thursday ?? false,
                        friday: habit.friday ?? false,
                        saturday: habit.saturday ?? false,
                        sunday: habit.sunday ?? false,
                    });
                }
            };
            loadHabit();
        } else {
            setTask('');
            setDescription('');
            setSchedule({
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
            });
        }
    }, [editMode, idHabit]);

    const toggleDay = (dayKey: keyof typeof schedule) => {
        setSchedule(prev => ({
            ...prev,
            [dayKey]: !prev[dayKey]
        }));
    };

    const handleSave = async () => {
        if (!task.trim()) {
            setIsError(true);
            return;
        }
        setIsError(false);
        try {
            if (editMode) {
                await updateHabit(
                    idHabit,
                    task,
                    description,
                    schedule.monday,
                    schedule.tuesday,
                    schedule.wednesday,
                    schedule.thursday,
                    schedule.friday,
                    schedule.saturday,
                    schedule.sunday
                );
            } else {
                await createHabit(
                    task,
                    description,
                    schedule.monday,
                    schedule.tuesday,
                    schedule.wednesday,
                    schedule.thursday,
                    schedule.friday,
                    schedule.saturday,
                    schedule.sunday
                );
            }
            if (onSave) onSave();
            if (onClose) onClose();
        } catch (error) {
            console.error('Error saving habit:', error);
        }
    };

    return (
        <FormControl size="md" isInvalid={isError}>
            <FormControlLabel>
                <FormControlLabelText>Habit Title</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    placeholder="e.g. Read 15 pages"
                    value={task}
                    onChangeText={(text) => {
                        setTask(text);
                        if (isError && text.trim()) setIsError(false);
                    }}
                />
            </Input>

            <FormControlLabel className="mt-4">
                <FormControlLabelText>Description (Optional)</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    placeholder="e.g. In the morning after coffee"
                    value={description}
                    onChangeText={setDescription}
                />
            </Input>

            <FormControlLabel className="mt-4">
                <FormControlLabelText>Frequency / Schedule</FormControlLabelText>
            </FormControlLabel>
            <Box className="flex-row justify-between mt-2 mb-1 w-full gap-2">
                {DAYS_OF_WEEK.map((day) => {
                    const isSelected = schedule[day.key as keyof typeof schedule];
                    return (
                        <Pressable
                            key={day.key}
                            onPress={() => toggleDay(day.key as keyof typeof schedule)}
                            className={`w-9 h-9 rounded-full items-center justify-center border ${
                                isSelected
                                    ? 'bg-red-600 border-red-600'
                                    : 'border-neutral-300 dark:border-neutral-700 bg-transparent'
                            }`}
                        >
                            <Text
                                size="sm"
                                className={`font-bold ${
                                    isSelected
                                        ? 'text-white'
                                        : 'text-typography-600 dark:text-typography-400'
                                }`}
                            >
                                {day.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </Box>

            {isError && (
                <FormControlError className="mt-2">
                    <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                    <FormControlErrorText className="text-red-500">
                        Please enter a valid habit title.
                    </FormControlErrorText>
                </FormControlError>
            )}

            <Button
                onPress={handleSave}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 mt-6 border-none"
            >
                <ButtonText className="text-white font-bold">Save Habit</ButtonText>
            </Button>
        </FormControl>
    );
};
