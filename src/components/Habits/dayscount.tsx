import { View, Text } from "react-native";

export default function DaysCount() {
    const today = new Date()

    return (
        <View className="justify-center items-center mt-5 bg-red-600 h-15">
            <Text className="bg-blue-600">{today.toDateString()}</Text>
            <View className="flex-row mt-3">
                <View className="bg-green-500 rounded-3xl w-10 h-10 m-1" />
                <View className="bg-green-500 rounded-full w-10 h-10 m-1" />
                <View className="bg-green-500 rounded-full w-10 h-10 m-1" />
                <View className="bg-green-500 rounded-full w-10 h-10 m-1" />
                <View className="bg-green-500 rounded-full w-10 h-10 m-1" />
                <View className="bg-green-500 rounded-full w-10 h-10 m-1" />
                <View className="bg-green-500 rounded-full w-10 h-10" />
            </View>
        </View>
    );
}