import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "react-native";
import { Icon, TrashIcon, EditIcon } from "@/components/ui/icon";

export default function Habit({ 
    Title, 
    Description, 
    Check = false,
    habitSchedule,
    onToggle,
    onEdit,
    onDelete
} : { 
    Title: string, 
    Description: string, 
    Check?: boolean,
    habitSchedule?: {
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
    },
    onToggle?: () => void,
    onEdit?: () => void,
    onDelete?: () => void
}) {
    const isTodayMode = !!onToggle;

    return (
        <Box className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 mb-3 bg-white dark:bg-neutral-900 flex-row justify-between items-center">
            <Box className="flex-1 pr-2">
                <Text size="md" className="font-bold text-typography-900 mb-0.5">{Title}</Text>
                <Text size="xs" className="text-typography-400 font-medium">{Description}</Text>

                {!isTodayMode && habitSchedule && (
                    <Box className="flex-row gap-1 mt-2 flex-wrap">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                            const keys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                            const isScheduled = habitSchedule[keys[idx] as keyof typeof habitSchedule];
                            return (
                                <Box
                                    key={idx}
                                    className={`w-5 h-5 rounded-full items-center justify-center ${
                                        isScheduled
                                            ? 'bg-red-650 dark:bg-red-600'
                                            : 'bg-neutral-100 dark:bg-neutral-800'
                                    }`}
                                >
                                    <Text
                                        className={`text-[9px] font-bold ${
                                            isScheduled
                                                ? 'text-white'
                                                : 'text-neutral-400 dark:text-neutral-600'
                                        }`}
                                    >
                                        {day}
                                    </Text>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>
            
            {isTodayMode ? (
                <Pressable 
                    onPress={onToggle}
                    className={`w-10 h-10 rounded-xl items-center justify-center ${
                        Check 
                            ? 'bg-red-600 border border-red-600' 
                            : 'border border-neutral-300 dark:border-neutral-700 bg-transparent'
                    }`}
                >
                    {Check ? (
                        <Text className="text-white font-extrabold text-lg">✓</Text>
                    ) : (
                        <Text className="text-typography-400 dark:text-typography-600 font-bold text-lg">+</Text>
                    )}
                </Pressable>
            ) : (
                <Box className="flex-row items-center gap-2">
                    <Pressable 
                        onPress={onEdit}
                        className="w-9 h-9 rounded-lg items-center justify-center bg-neutral-100 dark:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700"
                    >
                        <Icon as={EditIcon} className="text-neutral-650 dark:text-neutral-300" size="sm" />
                    </Pressable>
                    <Pressable 
                        onPress={onDelete}
                        className="w-9 h-9 rounded-lg items-center justify-center bg-red-50 dark:bg-red-950/20 active:bg-red-100 dark:active:bg-red-950/40"
                    >
                        <Icon as={TrashIcon} className="text-red-600 dark:text-red-500" size="sm" />
                    </Pressable>
                </Box>
            )}
        </Box>
    );
}