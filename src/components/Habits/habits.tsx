import { ScrollView } from "react-native-gesture-handler";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function Habits() {
    return (
        <ScrollView>
            <View className="bg-green-500 w-full h-32">
                <Text>Habits</Text>
            </View>
        </ScrollView>
    );
}