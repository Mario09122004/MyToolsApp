import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useCRUDOrders, OrderWithProduct, OrderInput } from '@/src/hooks/entrepreneurship/useCRUDOrders';
import { ProductWithIngredients } from '@/src/hooks/entrepreneurship/useCRUDProducts';

// Import custom UI components
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon, TrashIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';

import { ReservationForm } from './subcomponents/ReservationForm';
import { ReservationItemRow } from './subcomponents/ReservationItemRow';

interface ReservationsViewProps {
    products: ProductWithIngredients[];
    onOrdersUpdated: () => void;
}

export const ReservationsView = ({ products, onOrdersUpdated }: ReservationsViewProps) => {
    const { queryOrders, deleteOrder, saveOrder } = useCRUDOrders();
    const [orders, setOrders] = useState<OrderWithProduct[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // Delete confirmation state
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const list = await queryOrders();
        setOrders(list);
    };

    const handleSaveOrder = async (newOrder: OrderInput) => {
        await saveOrder(newOrder);
        setIsAdding(false);
        await loadOrders();
        onOrdersUpdated();
    };

    const handleDeleteClick = (id: number) => {
        setSelectedOrderId(id);
        setDeleteConfirmVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedOrderId) {
            try {
                await deleteOrder(selectedOrderId);
                await loadOrders();
                onOrdersUpdated();
            } catch (err) {
                console.error("Error deleting reservation:", err);
            }
        }
        setDeleteConfirmVisible(false);
        setSelectedOrderId(null);
    };

    return (
        <View className="flex-1 p-4 gap-4 bg-neutral-50 dark:bg-neutral-950">
            {isAdding ? (
                <ReservationForm
                    products={products}
                    onCancel={() => setIsAdding(false)}
                    onSave={handleSaveOrder}
                />
            ) : (
                <View className="flex-1 gap-4">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-semibold text-neutral-500">
                            Active Reservations ({orders.length})
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (products.length === 0) return;
                                setIsAdding(true);
                            }}
                            className="bg-red-600 px-3 py-1.5 rounded-lg"
                        >
                            <Text className="text-white font-bold text-xs">+ Add New</Text>
                        </TouchableOpacity>
                    </View>

                    {orders.length === 0 ? (
                        <View className="flex-1 items-center justify-center p-6 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl bg-neutral-50 dark:bg-neutral-900">
                            <Text className="text-neutral-500 font-medium text-sm text-center">
                                No active reservations
                            </Text>
                            <Text className="text-neutral-400 text-xs text-center mt-1">
                                Pre-orders will automatically calculate recipe batch requirements.
                            </Text>
                        </View>
                    ) : (
                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                            <View className="gap-3 pb-24">
                                {orders.map((order) => (
                                    <ReservationItemRow
                                        key={order.id}
                                        order={order}
                                        onDeleteClick={handleDeleteClick}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    )}
                </View>
            )}

            {/* Custom AlertDialog for Delete Confirmation */}
            <AlertDialog isOpen={deleteConfirmVisible} onClose={() => setDeleteConfirmVisible(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md" className="text-typography-900 font-bold">Delete Reservation?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center text-neutral-600 dark:text-neutral-400 text-sm">
                            Are you sure you want to delete this reservation? This action cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5 gap-3 w-full flex-row justify-center">
                        <Button
                            size="sm"
                            onPress={handleConfirmDelete}
                            className="px-[30px] bg-red-600 active:bg-red-700 hover:bg-red-700 border-none"
                        >
                            <ButtonText className="font-bold text-white">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={() => setDeleteConfirmVisible(false)}
                            size="sm"
                            className="px-[30px] border-neutral-300 dark:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900"
                        >
                            <ButtonText className="font-bold text-typography-700">Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </View>
    );
};
