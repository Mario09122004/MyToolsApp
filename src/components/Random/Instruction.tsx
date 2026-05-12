import { Text } from "@/components/ui/text";
import { View } from "react-native";

export const Instruction = () => {
    return (
        <View className="bg-red-600">
            <Text className="text-center text-lg font-bold">Write the options.</Text>
            <Text className="text-center text-lg font-bold">Separate them with "enter" to write a new option.</Text>
        </View>
    )
}