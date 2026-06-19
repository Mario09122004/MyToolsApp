import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Icon, InfoIcon } from "@/components/ui/icon";
import Habit from "./habit";

export default function Habits(props: 
    | { 
        mode: 'today'; 
        logs: any[]; 
        onToggle: (id: number, currentCompleted: boolean) => void; 
      }
    | { 
        mode: 'manage'; 
        habits: any[]; 
        onEdit: (habitId: number) => void; 
        onDelete: (habitId: number) => void; 
      }
) {
    if (props.mode === 'today') {
        const { logs, onToggle } = props;
        if (!logs || logs.length === 0) {
            return (
                <Box className="w-full py-12 items-center justify-center bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-6 mb-24">
                    <Box className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center mb-3">
                        <Icon as={InfoIcon} size="xl" className="text-red-600 dark:text-red-500" />
                    </Box>
                    <Text className="text-typography-500 font-semibold text-center text-base">
                        No habits scheduled for today
                    </Text>
                    <Text className="text-typography-400 text-center mt-1 text-sm">
                        You can manage your habits and frequency under the 'Manage Habits' tab.
                    </Text>
                </Box>
            );
        }

        return (
            <ScrollView className="mb-20">
                {logs.map((log) => (
                    <Habit 
                        key={log.id} 
                        Title={log.task}
                        Description={log.description || "No description"}
                        Check={log.isCompleted}
                        onToggle={() => onToggle(log.id, log.isCompleted)}
                    />
                ))}
            </ScrollView>
        );
    } else {
        const { habits, onEdit, onDelete } = props;
        if (!habits || habits.length === 0) {
            return (
                <Box className="w-full py-12 items-center justify-center bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-6 mb-24">
                    <Box className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center mb-3">
                        <Icon as={InfoIcon} size="xl" className="text-red-600 dark:text-red-500" />
                    </Box>
                    <Text className="text-typography-500 font-semibold text-center text-base">
                        No habits registered yet
                    </Text>
                    <Text className="text-typography-400 text-center mt-1 text-sm">
                        Press the + button to create a new habit.
                    </Text>
                </Box>
            );
        }

        return (
            <ScrollView className="mb-20">
                {habits.map((habit) => (
                    <Habit 
                        key={habit.id} 
                        Title={habit.task}
                        Description={habit.description || "No description"}
                        habitSchedule={{
                            monday: habit.monday ?? false,
                            tuesday: habit.tuesday ?? false,
                            wednesday: habit.wednesday ?? false,
                            thursday: habit.thursday ?? false,
                            friday: habit.friday ?? false,
                            saturday: habit.saturday ?? false,
                            sunday: habit.sunday ?? false,
                        }}
                        onEdit={() => onEdit(habit.id)}
                        onDelete={() => onDelete(habit.id)}
                    />
                ))}
            </ScrollView>
        );
    }
}