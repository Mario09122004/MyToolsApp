import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { useEffect } from "react";
import { name_Screen } from "../helpers/name_screen";

export default function EntrepreneurshipScreen() {
    const { changeNameScreen } = name_Screen();

    useEffect(() => {
        changeNameScreen("Entrepreneurship")
    }, [])

    return (
        <View>
            <Text>EntrepreneurshipScreen</Text>
        </View>
    )
}