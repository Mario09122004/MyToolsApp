import { useEffect, useState, useCallback } from "react";
import { name_Screen } from "../helpers/name_screen";
import DonutGraph from "../components/Habits/donut graph";
import { ScrollView } from "react-native-gesture-handler";
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
import { Heading } from '@/components/ui/heading';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { FormHabit } from "../components/Habits/formHabit";

// Hooks
import { useInitHabits } from "../hooks/habits/init";
import { useHabitLogCRUD } from "../hooks/habits/habitlog_CRUD";
import { useHabitCRUD } from "../hooks/habits/habit_CRUD";

export default function HabitsScreen() {
    const { changeNameScreen } = name_Screen();
    const { initHabits } = useInitHabits();
    const { showAllHabitLogsToday, updateHabitLog } = useHabitLogCRUD();
    const { deleteHabit } = useHabitCRUD();

    const [todayLogs, setTodayLogs] = useState<any[]>([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
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
        };
        setupAndFetch();
    }, [refreshTrigger]);

    const handleToggleComplete = async (logId: number, currentCompleted: boolean) => {
        await updateHabitLog(logId, !currentCompleted);
        triggerRefresh();
    };

    const handleDeleteHabit = async (habitId: number) => {
        await deleteHabit(habitId);
        triggerRefresh();
    };

    const totalCount = todayLogs.length;
    const completedCount = todayLogs.filter(log => log.isCompleted).length;

    return (
        <>
            <ScrollView className="bg-neutral-50 dark:bg-neutral-950 flex-1 px-4 py-2">
                <DonutGraph completedCount={completedCount} totalCount={totalCount} />
                <DaysCount refreshTrigger={refreshTrigger} />
                <Habits 
                    logs={todayLogs} 
                    onToggle={handleToggleComplete} 
                    onDelete={handleDeleteHabit} 
                />
            </ScrollView>

            <AddHabit onPress={() => setAddModalVisible(true)} />

            {/* Add Habit Modal */}
            <Modal
                isOpen={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="border-b pb-3 relative">
                        <Heading size="lg" className="text-typography-900 font-bold">
                            Create New Habit
                        </Heading>
                        <ModalCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="py-4">
                        <FormHabit 
                            onSave={triggerRefresh} 
                            onClose={() => setAddModalVisible(false)} 
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}