import { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Rect, Line, Text } from 'react-native-svg';

const OptionsRoulette = { option: String }

export const Roulette = ({ options }: { options: String[] }) => {
    const [option, setOption] = useState<String[]>(options);
    const [rotation, setRotation] = useState<number>(0);
    const [textRotation, setTextRotation] = useState(0);

    console.log("opciones entraas:", option)
    console.log("Rotacion: ", rotation)
    useEffect(() => {
        console.log("Recreqando...")
        setOption(options);
        console.log("opciones:", option)
        console.log(option.length)
        setRotation(360 / option.length)
        console.log("Rotacion: ", rotation)
        setTextRotation(rotation / 2)
    }, [option, rotation, options])

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
                        <>
                            <Text
                                x="50" y="20"
                                textAnchor="middle"
                                transform={`rotate(${textRotation + (index * rotation)}, 50, 50)`}
                            >
                                {data}
                            </Text>
                            <Line x1="50" y1="50" x2="50" y2="5" stroke="red" strokeWidth="2.5" transform={`rotate(${index * rotation}, 50, 50)`} key={index} />
                        </>
                    ))
                }
            </Svg>
        </View>
    )
}

