import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProductWithIngredients } from '@/src/hooks/entrepreneurship/useCRUDProducts';

interface ProductPlannerItemRowProps {
    product: ProductWithIngredients;
    quantity: number;
    reqQty: number;
    reqBatches: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

export const ProductPlannerItemRow = ({
    product,
    quantity,
    reqQty,
    reqBatches,
    onIncrement,
    onDecrement
}: ProductPlannerItemRowProps) => {
    const isCovered = quantity >= reqBatches;

    return (
        <View className="bg-white dark:bg-neutral-900 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-2">
                    <Text className="font-bold text-sm text-typography-900">
                        {product.name}
                    </Text>
                    <Text className="text-xs text-typography-400 mt-0.5">
                        Yields {product.yieldAmount} {product.yieldUnit}
                    </Text>
                </View>
                
                {/* Counter Controls */}
                <View className="flex-row items-center gap-1">
                    <TouchableOpacity 
                        onPress={onDecrement}
                        disabled={quantity <= 0}
                        className={`w-8 h-8 rounded-lg items-center justify-center ${quantity <= 0 ? 'bg-neutral-50 dark:bg-neutral-900 opacity-40' : 'bg-neutral-100 dark:bg-neutral-800'}`}
                    >
                        <Text className={`font-bold ${quantity <= 0 ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-800 dark:text-neutral-200'}`}>-</Text>
                    </TouchableOpacity>

                    <View className="w-12 h-8 items-center justify-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
                        <Text className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                            {quantity}
                        </Text>
                    </View>

                    <TouchableOpacity 
                        onPress={onIncrement}
                        className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
                    >
                        <Text className="font-bold text-neutral-800 dark:text-neutral-200">+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Reservation requirement label */}
            {reqBatches > 0 && (
                <View className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <Text className="text-xs font-bold text-red-600 dark:text-red-400">
                        ★ Reservations: {reqQty} units ({reqBatches} {reqBatches === 1 ? 'batch' : 'batches'} needed) {isCovered ? '(Covered ✓)' : '(Pending)'}
                    </Text>
                </View>
            )}
        </View>
    );
};
