import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useHabitLogCRUD } from "@/src/hooks/habits/habitlog_CRUD";

export default function DaysCount({ refreshTrigger }: { refreshTrigger?: number }) {
    const today = new Date();
    const { getHabitLogsForPastDays } = useHabitLogCRUD();
    const [activeDays, setActiveDays] = useState<Record<number, boolean>>({});
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchPastLogs = async () => {
            try {
                // Fetch logs for the past 30 days to accurately compute streak & completion
                const logs = await getHabitLogsForPastDays(30);

                // Group logs by day timestamp
                const logsByDay: Record<number, { total: number; completed: number }> = {};

                logs.forEach(log => {
                    const dayTime = log.day;
                    if (!logsByDay[dayTime]) {
                        logsByDay[dayTime] = { total: 0, completed: 0 };
                    }
                    logsByDay[dayTime].total += 1;
                    if (log.isCompleted) {
                        logsByDay[dayTime].completed += 1;
                    }
                });

                // Determine completed days (all logs completed and at least 1 log exists)
                const activeMap: Record<number, boolean> = {};
                Object.entries(logsByDay).forEach(([dayTimeStr, data]) => {
                    const dayTime = Number(dayTimeStr);
                    activeMap[dayTime] = data.total > 0 && data.completed === data.total;
                });
                setActiveDays(activeMap);

                // Calculate current streak (backwards from today/yesterday)
                let currentStreak = 0;
                let checkDate = new Date();
                checkDate.setHours(0, 0, 0, 0);

                const todayMidnight = checkDate.getTime();
                const todayLogs = logsByDay[todayMidnight];
                const isTodayCompleted = todayLogs && todayLogs.total > 0 && todayLogs.completed === todayLogs.total;

                let startCheckDate = new Date();
                startCheckDate.setHours(0, 0, 0, 0);

                // If today is not completed yet, check if yesterday was completed to continue streak
                if (!isTodayCompleted) {
                    startCheckDate.setDate(startCheckDate.getDate() - 1);
                }

                while (true) {
                    const timestamp = startCheckDate.getTime();
                    const dayLogs = logsByDay[timestamp];

                    if (dayLogs && dayLogs.total > 0 && dayLogs.completed === dayLogs.total) {
                        currentStreak++;
                        startCheckDate.setDate(startCheckDate.getDate() - 1);
                    } else {
                        break;
                    }
                }

                setStreak(currentStreak);
            } catch (error) {
                console.error("Error fetching past logs:", error);
            }
        };

        fetchPastLogs();
    }, [refreshTrigger, getHabitLogsForPastDays]);

    // Build the 7-day grid from 6 days ago up to today
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);

        const dayString = d.toLocaleDateString('en-US', { weekday: 'short' });
        days.push({
            label: dayString,
            timestamp: d.getTime(),
            active: activeDays[d.getTime()] || false
        });
    }

    return (
        <Card size="md" variant="outline" className="p-4 mb-4">
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
                        {streak} day{streak !== 1 ? 's' : ''} streak
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