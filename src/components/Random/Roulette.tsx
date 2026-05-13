import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Rect, Line } from 'react-native-svg';

const OptionsRoulette = { option: String }

export const Roulette = ({ options }: { options: String[] }) => {
    const [option, setOption] = useState<String[]>(options);

    if (options.length < 2) {
        return (
            <View>
                <Text>Agrega al menos 2 opciones</Text>
            </View>
        )
    }

    return (
        <View className="bg-blue-500 items-center">
            <Svg height="50%" width="100%" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r="45" stroke="red" strokeWidth="2.5" fill="green" />
                {
                    option.map((data, index) => (
                        <Line x1="50" y1="50" x2="50" y2="5" stroke="red" strokeWidth="2.5" transform={`rotate(${index * 5}, 50, 50)`} key={index} />
                    ))
                }
                <Line x1="50" y1="50" x2="50" y2="5" stroke="black" strokeWidth="2.5" transform="rotate(0, 50, 50)" />
            </Svg>
        </View>
    )
}