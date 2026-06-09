import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { useState } from "react";

export default function Habit({ Title, Description, Check = false } : { Title: string, Description: string, Check?: boolean }) {
    const [isCompleted, setIsCompleted] = useState(Check);

    return (
        <Box className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 mb-3 bg-background-neutral flex-row justify-between items-center">
            <Box className="flex-1 pr-4">
                <Text size="md" className="font-bold text-typography-900 mb-0.5">{Title}</Text>
                <Text size="xs" className="text-typography-400 font-medium">{Description}</Text>
            </Box>
            <Pressable 
                onPress={() => setIsCompleted(!isCompleted)}
                className={`w-10 h-10 rounded-xl items-center justify-center ${
                    isCompleted 
                        ? 'bg-red-600 border border-red-600' 
                        : 'border border-neutral-300 dark:border-neutral-700 bg-transparent'
                }`}
            >
                {isCompleted ? (
                    <Text className="text-white font-extrabold text-lg">✓</Text>
                ) : (
                    <Text className="text-typography-400 dark:text-typography-600 font-bold text-lg">+</Text>
                )}
            </Pressable>
        </Box>
    );
}