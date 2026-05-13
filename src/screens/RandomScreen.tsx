import { View } from "react-native"
import { Instruction } from "@/src/components/Random/Instruction"
import { InputRandom } from "@/src/components/Random/InputRandom"

export default function RandomScreen() {
    return (
        <View className="p-1 bg-green-500 h-full">
            <Instruction />
            <InputRandom />
        </View>
    )
}