import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Rect, Line, Text } from 'react-native-svg';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

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

    //Check if detec the speed of the roulette in terminal
    const panGesture = Gesture.Pan()
        .onStart((event) => {
            console.log("Inicio - X:", event.x.toFixed(2), "Y:", event.y.toFixed(2));
        })
        .onUpdate((event) => {
            if (Math.abs(event.translationX) % 20 < 2) {
                console.log("Movimiento X:", event.translationX.toFixed(2));
            }
        })
        .onEnd((event) => {
            console.log("Fin - Velocidad final:", event.velocityX.toFixed(2));
        });

    return (
        <View className="bg-blue-500 items-center w-full h-3/5">
            <GestureHandlerRootView style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <GestureDetector gesture={panGesture}>
                    <Svg height="100%" width="100%" viewBox="0 0 100 100" className="bg-red-600">
                        <Circle cx="50" cy="50" r="45" stroke="red" strokeWidth="1.5" fill="green" />
                        {
                            option.map((data, index) => (
                                <View key={index} >
                                    <Text
                                        x="50" y="20"
                                        textAnchor="middle"
                                        transform={`rotate(${textRotation + (index * rotation)}, 50, 50)`}
                                    >
                                        {data}
                                    </Text>
                                    <Line x1="50" y1="50" x2="50" y2="5" stroke="red" strokeWidth="1" transform={`rotate(${index * rotation}, 50, 50)`} />
                                </View>
                            ))
                        }
                    </Svg>
                </GestureDetector>
            </GestureHandlerRootView>
        </View>
    )
}

