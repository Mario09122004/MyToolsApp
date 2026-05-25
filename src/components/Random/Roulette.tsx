import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Rect, Line, Text, Polygon, G } from 'react-native-svg';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { withDecay } from 'react-native-reanimated';
import { Text as TextApp } from "@/components/ui/text";

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

    //Animation
    const rotate = useSharedValue(0);

    //Check if detec the speed of the roulette in terminal
    const startRotation = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onStart((event) => {
            startRotation.value = rotate.value;
            //console.log("Inicio - X:", event.x.toFixed(2), "Y:", event.y.toFixed(2));
        })
        .onUpdate((event) => {
            rotate.value = startRotation.value + (event.translationX * 0.2);
            /*if (Math.abs(event.translationX) % 20 < 2) {
                console.log("Movimiento X:", event.translationX.toFixed(2));
            }*/
        })
        .onEnd((event) => {
            //console.log("Fin - Velocidad final:", event.velocityX.toFixed(2));
            console.log("slowing down...");
            rotate.value = withDecay({
                velocity: event.velocityX * 0.5,
                deceleration: 0.9999,
            });
        });
        
    const wheelAnimatedStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    { rotate: `${rotate.value}deg` }
                ],
            };
    });

    if (options.length < 2) {
        return (
            <View>
                <TextApp>Agrega al menos 2 opciones</TextApp>
            </View>
        )
    }

    return (
        <View className="bg-blue-500 items-center w-full h-3/5">
            <GestureHandlerRootView style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[wheelAnimatedStyle, { width: "100%", height: "100%" }]} >
                        <Svg height="100%" width="100%" viewBox="0 0 100 100" className="bg-red-600">
                            <Circle cx="50" cy="50" r="45" stroke="red" strokeWidth="1.5" fill="green" />
                            {
                                option.map((data, index) => (
                                    <G key={index}>
                                        <Text
                                            x="50" y="20"
                                            textAnchor="middle"
                                            transform={`rotate(${textRotation + (index * rotation)}, 50, 50)`}
                                        >
                                            {data}
                                        </Text>
                                        <Line x1="50" y1="50" x2="50" y2="5" stroke="red" strokeWidth="1" transform={`rotate(${index * rotation}, 50, 50)`} />
                                    </G>
                                ))
                            }
                            <Polygon
                                points="50,75 40,100 60,100"
                                fill="yellow"
                            />
                        </Svg>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </View>
    )
}

