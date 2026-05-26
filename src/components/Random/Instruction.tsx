import { Text } from "@/components/ui/text";
import { View } from "react-native";

export const Instruction = () => {
    return (
        <View>
            <Text className="text-center text-lg font-bold">Write the options.</Text>
            <Text className="text-center text-lg font-bold">Separate them with "enter" to write a new option.</Text>
        </View>
    )
}