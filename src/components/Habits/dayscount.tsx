import { View, Text } from "react-native";

import Svg, { Circle, Line, Text as Textsvg, G, Rect } from 'react-native-svg';

export default function DaysCount() {
    const today = new Date()

    return (
        <View className="justify-center items-center mt-5 bg-red-600 h-15">
            <Text className="bg-blue-600">{today.toDateString()}</Text>
            <Svg height="50%" width="100%" viewBox="10 0 100 50">
                <Rect x="10" y="10" width="15" height="15" fill="#FFFF00" />
                <Rect x="30" y="10" width="15" height="15" fill="#FFFF00" />
                <Rect x="50" y="10" width="15" height="15" fill="#FFFF00" />
                <Rect x="70" y="10" width="15" height="15" fill="#FFFF00" />
                <Rect x="90" y="10" width="15" height="15" fill="#FFFF00" />
                <Rect x="110" y="10" width="15" height="15" fill="#FFFF00" />
                <Rect x="130" y="10" width="15" height="15" fill="#FFFF00" />
            </Svg>
        </View>
    );
}