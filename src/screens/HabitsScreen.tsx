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
        <ScrollView className="px-4">
            <AddHabit />
            <DonutGraph />
            <DaysCount />
            <Habits />
        </ScrollView>
    )
}