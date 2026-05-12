import { Text } from "@/components/ui/text"
import { View } from "react-native"
import { Instruction } from "@/src/components/Random/Instruction"

export default function RandomScreen() {
    return (
        <View className="p-1 bg-green-500">
            <Instruction />
            <Text>Random Screen</Text>
        </View>
    )
}