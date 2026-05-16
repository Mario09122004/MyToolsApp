import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { useEffect } from "react";
import { name_Screen } from "../helpers/name_screen";

export default function HabitsScreen() {
    const { changeNameScreen } = name_Screen();

    useEffect(() => {
        changeNameScreen("Habits")
    }, [])

    return (
        <View>
            <Text>HabitsScreen</Text>
        </View>
    )
}