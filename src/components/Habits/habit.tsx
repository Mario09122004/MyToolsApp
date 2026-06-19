import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Icon, TrashIcon } from "@/components/ui/icon";

export default function Habit({ 
    Title, 
    Description, 
    Check = false,
    onToggle,
    onEdit,
    onDelete
} : { 
    Title: string, 
    Description: string, 
    Check?: boolean,
    onToggle: () => void,
    onEdit?: () => void,
    onDelete: () => void
}) {
    return (
        <Box className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 mb-3 bg-white dark:bg-neutral-900 flex-row justify-between items-center">
            <Pressable onPress={onEdit} className="flex-1 pr-2">
                <Text size="md" className="font-bold text-typography-900 mb-0.5">{Title}</Text>
                <Text size="xs" className="text-typography-400 font-medium">{Description}</Text>
            </Pressable>
            
            <Box className="flex-row items-center gap-3">
                <Pressable 
                    onPress={onDelete}
                    className="w-10 h-10 rounded-xl items-center justify-center active:bg-red-50 dark:active:bg-red-950/20"
                >
                    <Icon as={TrashIcon} className="text-neutral-400 active:text-red-600 dark:active:text-red-500" />
                </Pressable>

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
            </Box>
        </Box>
    );
}