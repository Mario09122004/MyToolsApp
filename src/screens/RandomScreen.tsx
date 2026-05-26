import { View } from "react-native"
import { Instruction } from "@/src/components/Random/Instruction"
import { InputRandom } from "@/src/components/Random/InputRandom"
import { useEffect } from "react";
import { name_Screen } from "../helpers/name_screen";

export default function RandomScreen() {
    const { changeNameScreen } = name_Screen();

    useEffect(() => {
        changeNameScreen("Random")
    }, [])

    return (
        <View className="p-1 h-full">
            <Instruction />
            <InputRandom />
        </View>
    )
}