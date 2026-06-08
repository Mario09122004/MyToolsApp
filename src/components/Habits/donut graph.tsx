import React from 'react'
import { ProgressCircle } from 'react-native-svg-charts'
import Svg, { Circle, Line, Text, G } from 'react-native-svg';
import { View } from 'react-native';

export default function DonutGraph() {
    return (
        <>
            <ProgressCircle style={{ height: 200 }} progress={0.7} progressColor={'#FF0000'} />
            <View className="absolute inset-0 items-center justify-center text-center">
                <Svg height="50%" width="100%" viewBox="-1 -12 100 50">
                    <Text x="50" y="25" textAnchor="middle" fill="#FF0000" fontSize="25">70%</Text>
                </Svg>
            </View>
        </>
    )
}   