import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";

export default function DaysCount() {
    const today = new Date()

    const todayDate = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'short' 
    })
    
    const days = [
        { label: "L", active: false },
        { label: "M", active: true },
        { label: "M", active: false },
        { label: "J", active: true },
        { label: "V", active: true },
        { label: "S", active: false },
        { label: "D", active: false },
    ];

    const completedCount = days.filter(day => day.active).length;

    return (
        <Card size="md" variant="outline" className="p-4">
            <View className="flex-row justify-between items-center mb-3">
                <View>
                    <Text size="sm" className="text-typography-900 font-bold capitalize mt-0.5">
                        {
                        today.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'short' 
                        })
                        }
                    </Text>
                </View>
                <View className="bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-full">
                    <Text size="xs" className="text-red-600 dark:text-red-400 font-bold">
                        {completedCount} days
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center mt-2 px-1">
                {days.map((day, index) => (
                    <View key={index} className="items-center flex-1">
                        <Text size="xs" className="mb-1.5 font-bold text-typography-400">
                            {day.label}
                        </Text>
                        <View 
                            className={`w-9 h-9 rounded-full items-center justify-center ${
                                day.active 
                                    ? 'bg-red-600 border border-red-600' 
                                    : 'border border-neutral-300 dark:border-neutral-800 bg-transparent'
                            }`}
                        >
                            {day.active ? (
                                <Text className="text-white font-bold text-sm">✓</Text>
                            ) : (
                                <View className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </Card>
    );
}