import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { useEffect } from "react";
import { name_Screen } from "../helpers/name_screen";
import { Mapadd } from "../components/MapAdd/map";

export default function ProgramingMessageScreen() {
    const { changeNameScreen } = name_Screen();

    useEffect(() => {
        changeNameScreen("Auto Message")
    }, [])

    return (
        <View>
            <Text>ProgramingMessageScreen</Text>
            <Mapadd />
        </View>
    )
}