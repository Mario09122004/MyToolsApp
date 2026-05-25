import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Rect, Line, Text, Polygon, G } from 'react-native-svg';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { withDecay } from 'react-native-reanimated';
import { Text as TextApp } from "@/components/ui/text";
import { Arrow } from "./arrow";

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
            //init with 0
            startRotation.value = rotate.value;
        })
        .onUpdate((event) => {
            //add speed in rotation
            rotate.value = startRotation.value + (event.translationX * -0.2);
        })
        .onEnd((event) => {
            // start to slowing down 
            console.log("slowing down...");
            rotate.value = withDecay({
                velocity: event.velocityX * 0.5,
                deceleration: 0.9999,
            },
            (finished) => {
                console.log("finished", finished);
            }
        );
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
        <>
        <View className="items-center w-full bg-blue-600 aspect-square">
            <GestureHandlerRootView style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[wheelAnimatedStyle, { width: "100%", height: "100%" }]} >
                        <Svg height="100%" width="100%"viewBox="0 0 100 100">
                            
                            <Rect x="0" y="0" width="100%" height="100%" fill="orange" />

                            <Circle cx="50" cy="50" r="45" stroke="red" strokeWidth="0.5" fill="green" />
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
                        </Svg>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </View>
        <View className="bg-red-600 h-[10%] w-full -mt-16">
            <Arrow />
        </View>
        </>
    )
}

