import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { useEffect } from "react";
import { name_Screen } from "../helpers/name_screen";
import DonutGraph from "../components/Habits/donut graph";
import { ScrollView } from "react-native-gesture-handler";
import DaysCount from "../components/Habits/dayscount";
import Habits from "../components/Habits/habits";
import AddHabit from "../components/Habits/addhabit";

export default function HabitsScreen() {
    const { changeNameScreen } = name_Screen();

    useEffect(() => {
        changeNameScreen("Habits")
    }, [])

    return (
        <ScrollView className="bg-neutral-50 dark:bg-neutral-950 flex-1 px-4 py-2">
            <AddHabit />
            <DonutGraph />
            <DaysCount />
            <Habits />
        </ScrollView>
    )
}