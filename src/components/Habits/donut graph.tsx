import React from 'react'
import { ProgressCircle } from 'react-native-svg-charts'
import { View } from 'react-native';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export default function DonutGraph() {
    const progress = 0.7;

    return (
        <Card size="md" className="p-4 items-center bg-current">
            <View className="relative items-center justify-center w-full">
                <ProgressCircle
                    style={{ height: 160, width: 160 }}
                    progress={progress}
                    progressColor={'rgb(220, 38, 38)'}
                    backgroundColor={'rgba(220, 38, 38, 0.12)'}
                    strokeWidth={12}
                />
                <View className="absolute items-center justify-center">
                    <Text size="3xl" className="font-extrabold text-red-600 dark:text-red-500">
                        {Math.round(progress * 100)}%
                    </Text>
                    <Text size="xs" className="text-typography-500 font-medium mt-0.5">
                        Completed
                    </Text>
                </View>
            </View>
        </Card>
    )
}