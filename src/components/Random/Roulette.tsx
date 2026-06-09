import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Text, G, Path, Line } from 'react-native-svg';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { withDecay } from 'react-native-reanimated';
import { Text as TextApp } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Arrow } from "./arrow";

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';

export const Roulette = ({ options, setWriteOptions, setOptions }: { options: String[], setWriteOptions: (writeoptions: boolean) => void, setOptions: (options:string) => void }) => {
    const [option, setOption] = useState<String[]>(options);
    const [rotation, setRotation] = useState<number>(0);
    const [textRotation, setTextRotation] = useState(0);
    //Modal
    const [showModal, setShowModal] = React.useState(false);
    const [winnerName, setWinnerName] = useState("");

    useEffect(() => {
        setOption(options);
        if (options.length > 0) {
            const newRotation = 360 / options.length;
            setRotation(newRotation);
            setTextRotation(newRotation / 2);
        }
    }, [options])

    //Animation
    const rotate = useSharedValue(0);

    //Check if detec the speed of the roulette in terminal
    const startRotation = useSharedValue(0);

    const reportDegrees = (degrees: number) =>{
        let cleanDegrees = Math.round(degrees + 180) % 360;
        if (cleanDegrees < 0) {
            cleanDegrees += 360;
        }

        let targetAngle = (360 - cleanDegrees) % 360;

        const sliceSize = 360 / option.length;

        //Discover the index of the winner with floor which rounded to down value
        const selectedIndex = Math.floor(targetAngle / sliceSize);
        const winnerOption = option[selectedIndex];

        // Winner
        setWinnerNameModal(winnerOption as string);
    }
    
    const setWinnerNameModal = async (name: string) =>{
        await setWinnerName(name.toString());
        setShowModal(true);
    }

    const panGesture = Gesture.Pan()
        .onStart((event) => {
            //init with 0
            startRotation.value = rotate.value;
            runOnJS(setWriteOptions)(true);
        })
        .onUpdate((event) => {
            //add speed in rotation
            rotate.value = startRotation.value + (event.translationX * -0.2);
        })
        .onEnd((event) => {
            // start to slowing down 
            rotate.value = withDecay({
                velocity: event.velocityX * 0.5,
                deceleration: 0.9999,
            },
            (finished) => {
                runOnJS(reportDegrees)(rotate.value);
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

    if (options.length < 1) {
        return (
            <View>
                <TextApp>Add options to the roulette.</TextApp>
            </View>
        )
    }

    return (
        <>
        <View className="items-center w-full aspect-square">
            <GestureHandlerRootView style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[wheelAnimatedStyle, { width: "100%", height: "100%" }]} >
                        <Svg height="100%" width="100%" viewBox="0 0 100 100">
                            <Circle cx="50" cy="50" r="45" stroke="#969696" strokeWidth="0.5" fill="#c3073f" />
                            {
                                option.map((data, index) => (
                                    <G key={index}>
                                        <Text
                                            x="50" y="20"
                                            textAnchor="middle"
                                            fill="#969696"
                                            transform={`rotate(${textRotation + (index * rotation)}, 50, 50)`}
                                        >
                                            {data}
                                        </Text>
                                        <Line x1="50" y1="50" x2="50" y2="5" stroke="#969696" strokeWidth="1" transform={`rotate(${index * rotation}, 50, 50)`} />
                                    </G>
                                ))
                            }
                        </Svg>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </View>
        <View className="h-[10%] w-full -mt-16">
            <Arrow />
        </View>
        <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setWriteOptions(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalBody>
            <TextApp 
                className="text-center text-5xl font-bold text-[#FF0000]"
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {winnerName}
            </TextApp>
          </ModalBody>
          <ModalFooter className="justify-center">
            <Button
              onPress={() => {
                setShowModal(false);
                setWriteOptions(false);
              }}
              className="w-1/2 text-center"
            >
              <ButtonText>
                Ok
              </ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModal(false);
                setWriteOptions(false);
                const newOptions = option.filter((_, index) => index !== option.indexOf(winnerName));
                setOption(newOptions);
                const stringOptions = newOptions.join("\n");
                setOptions(stringOptions);
              }}
              className="w-1/2 text-center"
              variant="outline"
            >
              <ButtonText className="text-typography-600 dark:text-typography-400 font-bold">
                Discard
              </ButtonText>
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

