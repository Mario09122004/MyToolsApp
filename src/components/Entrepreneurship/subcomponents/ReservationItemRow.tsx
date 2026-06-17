import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { OrderWithProduct } from '@/src/hooks/entrepreneurship/useCRUDOrders';

interface ReservationItemRowProps {
    order: OrderWithProduct;
    onDeleteClick: (id: number) => void;
}

export const ReservationItemRow = ({
    order,
    onDeleteClick
}: ReservationItemRowProps) => {
    return (
        <View className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 flex-row justify-between items-center">
            <View className="flex-1 pr-2">
                <View className="flex-row items-baseline gap-1.5 flex-wrap">
                    <Text className="font-bold text-sm text-neutral-800 dark:text-neutral-100">
                        {order.customerName}
                    </Text>
                    <Text className="text-xs text-neutral-500 font-medium">
                        reserved {order.quantity} x {order.productName}
                    </Text>
                </View>
                {order.dueDate ? (
                    <Text className="text-xs text-red-650 dark:text-red-400 mt-1 font-semibold">
                        Due: {order.dueDate}
                    </Text>
                ) : null}
            </View>
            
            <TouchableOpacity
                onPress={() => onDeleteClick(order.id)}
                className="p-2 bg-red-100 dark:bg-red-950/40 rounded-lg"
            >
                <Text className="text-red-655 dark:text-red-400 font-bold text-xs">Delete</Text>
            </TouchableOpacity>
        </View>
    );
};
