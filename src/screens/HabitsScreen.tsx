import { useEffect, useState, useCallback } from "react";
import { name_Screen } from "../helpers/name_screen";
import DonutGraph from "../components/Habits/donut graph";
import { ScrollView, Text, Pressable } from "react-native";
import DaysCount from "../components/Habits/dayscount";
import Habits from "../components/Habits/habits";
import AddHabit from "../components/Habits/addhabit";
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from '@/components/ui/modal';
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Icon, CloseIcon, TrashIcon } from '@/components/ui/icon';
import { FormHabit } from "../components/Habits/formHabit";

// Hooks
import { useInitHabits } from "../hooks/habits/init";
import { useHabitLogCRUD } from "../hooks/habits/habitlog_CRUD";
import { useHabitCRUD } from "../hooks/habits/habit_CRUD";

export default function HabitsScreen() {
    const { changeNameScreen } = name_Screen();
    const { initHabits } = useInitHabits();
    const { showAllHabitLogsToday, updateHabitLog } = useHabitLogCRUD();
    const { deleteHabit, showAllHabits } = useHabitCRUD();

    const [todayLogs, setTodayLogs] = useState<any[]>([]);
    const [allHabits, setAllHabits] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'today' | 'manage'>('today');

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedHabitId, setSelectedHabitId] = useState<number>(0);
    
    const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false);
    const [idHabitToDelete, setIdHabitToDelete] = useState<number>(0);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        changeNameScreen("Habits")
    }, [])

    useEffect(() => {
        const setupAndFetch = async () => {
            await initHabits();
            const logs = await showAllHabitLogsToday();
            setTodayLogs(logs);
            const habitsList = await showAllHabits();
            setAllHabits(habitsList);
        };
        setupAndFetch();
    }, [refreshTrigger]);

    const handleToggleComplete = async (logId: number, currentCompleted: boolean) => {
        await updateHabitLog(logId, !currentCompleted);
        triggerRefresh();
    };

    const handleNewHabit = () => {
        setEditMode(false);
        setSelectedHabitId(0);
        setAddModalVisible(true);
    };

    const handleEditHabit = (habitId: number) => {
        setEditMode(true);
        setSelectedHabitId(habitId);
        setAddModalVisible(true);
    };

    const openDeleteConfirm = (habitId: number) => {
        setIdHabitToDelete(habitId);
        setDeleteConfirmModalVisible(true);
    };

    const closeDeleteConfirm = () => {
        setIdHabitToDelete(0);
        setDeleteConfirmModalVisible(false);
    };

    const handleDeleteHabit = async () => {
        if (idHabitToDelete > 0) {
            await deleteHabit(idHabitToDelete);
            triggerRefresh();
        }
        closeDeleteConfirm();
    };

    const totalCount = todayLogs.length;
    const completedCount = todayLogs.filter(log => log.isCompleted).length;

    return (
        <>
            <ScrollView className="bg-neutral-50 dark:bg-neutral-950 flex-1 px-4 py-2">
                <DonutGraph completedCount={completedCount} totalCount={totalCount} />
                <DaysCount refreshTrigger={refreshTrigger} />
                
                {/* Tab Switcher */}
                <Box className="flex-row bg-neutral-200 dark:bg-neutral-900 p-1 rounded-xl mb-4 gap-1">
                    <Pressable
                        onPress={() => setActiveTab('today')}
                        className={`flex-1 py-2 rounded-lg items-center ${
                            activeTab === 'today'
                                ? 'bg-white dark:bg-neutral-800 shadow-sm'
                                : 'bg-transparent'
                        }`}
                    >
                        <Text className={`font-bold text-sm ${
                            activeTab === 'today'
                                ? 'text-red-600 dark:text-red-500'
                                : 'text-typography-500 dark:text-typography-400'
                        }`}>
                            Today's Checklist
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveTab('manage')}
                        className={`flex-1 py-2 rounded-lg items-center ${
                            activeTab === 'manage'
                                ? 'bg-white dark:bg-neutral-800 shadow-sm'
                                : 'bg-transparent'
                        }`}
                    >
                        <Text className={`font-bold text-sm ${
                            activeTab === 'manage'
                                ? 'text-red-600 dark:text-red-500'
                                : 'text-typography-500 dark:text-typography-400'
                        }`}>
                            Manage Habits
                        </Text>
                    </Pressable>
                </Box>

                {activeTab === 'today' ? (
                    <Habits 
                        mode="today"
                        logs={todayLogs} 
                        onToggle={handleToggleComplete} 
                    />
                ) : (
                    <Habits 
                        mode="manage"
                        habits={allHabits} 
                        onEdit={handleEditHabit}
                        onDelete={openDeleteConfirm} 
                    />
                )}
            </ScrollView>

            <AddHabit onPress={handleNewHabit} />

            {/* Add/Edit Habit Modal */}
            <Modal
                isOpen={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="border-b pb-3 relative">
                        <Heading size="lg" className="text-typography-900 font-bold">
                            {editMode ? "Edit Habit" : "Create New Habit"}
                        </Heading>
                        <ModalCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="py-4">
                        <FormHabit 
                            editMode={editMode}
                            idHabit={selectedHabitId}
                            onSave={triggerRefresh} 
                            onClose={() => setAddModalVisible(false)} 
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog isOpen={deleteConfirmModalVisible} onClose={closeDeleteConfirm}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md" className="text-typography-900 font-bold">Delete Habit?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center text-typography-600">
                            This habit and all its history will be deleted permanently. This cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5 gap-3 w-full flex-row justify-center">
                        <Button
                            size="sm"
                            onPress={handleDeleteHabit}
                            className="px-[30px] bg-red-600 active:bg-red-700 hover:bg-red-700 border-none"
                        >
                            <ButtonText className="font-bold text-white">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={closeDeleteConfirm}
                            size="sm"
                            className="px-[30px] border-neutral-300 dark:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900"
                        >
                            <ButtonText className="font-bold text-typography-700">Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}