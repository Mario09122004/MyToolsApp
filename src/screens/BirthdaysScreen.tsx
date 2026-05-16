import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { name_Screen } from "../helpers/name_screen";
import { useEffect } from "react";

export default function BirthdaysScreen() {
    const { changeNameScreen } = name_Screen();

    useEffect(() => {
        changeNameScreen("Birthdays")
    }, [])

    return (
        <View>
            <Text>BirthdaysScreen</Text>
        </View>
    )
}