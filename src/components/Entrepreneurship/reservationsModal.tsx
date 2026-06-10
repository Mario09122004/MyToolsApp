import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useCRUDOrders, OrderWithProduct, OrderInput } from '@/src/hooks/entrepreneurship/useCRUDOrders';
import { ProductWithIngredients } from '@/src/hooks/entrepreneurship/useCRUDProducts';

interface ReservationsModalProps {
    visible: boolean;
    onClose: () => void;
    products: ProductWithIngredients[];
    onOrdersUpdated: () => void; // Triggered when reservations change so other components reload
}

export const ReservationsModal = ({ visible, onClose, products, onOrdersUpdated }: ReservationsModalProps) => {
    const { queryOrders, deleteOrder, saveOrder } = useCRUDOrders();
    const [orders, setOrders] = useState<OrderWithProduct[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // Form fields
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (visible) {
            loadOrders();
            // Pre-select first product if available
            if (products.length > 0) {
                setSelectedProductId(products[0].id);
            }
        }
    }, [visible, products]);

    const loadOrders = async () => {
        const list = await queryOrders();
        setOrders(list);
    };

    const handleAddOrder = async () => {
        if (!selectedProductId) {
            setErrorMsg('Please select a product');
            return;
        }
        if (!customerName.trim()) {
            setErrorMsg('Please enter customer name');
            return;
        }
        const qtyNum = parseFloat(quantity);
        if (isNaN(qtyNum) || qtyNum <= 0) {
            setErrorMsg('Please enter a valid quantity greater than 0');
            return;
        }

        setErrorMsg('');
        const newOrder: OrderInput = {
            productId: selectedProductId,
            customerName: customerName.trim(),
            quantity: qtyNum,
            dueDate: dueDate.trim() || null,
        };

        try {
            await saveOrder(newOrder);
            // Reset form
            setCustomerName('');
            setQuantity('');
            setDueDate('');
            setIsAdding(false);
            // Refresh
            await loadOrders();
            onOrdersUpdated();
        } catch (err) {
            console.error("Error saving reservation:", err);
            setErrorMsg("Failed to save reservation");
        }
    };

    const handleDeleteOrder = (id: number) => {
        Alert.alert(
            "Delete Reservation",
            "Are you sure you want to delete this reservation?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteOrder(id);
                            await loadOrders();
                            onOrdersUpdated();
                        } catch (err) {
                            console.error("Error deleting reservation:", err);
                        }
                    } 
                }
            ]
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/60">
                <View className="bg-white dark:bg-neutral-900 rounded-t-3xl h-[85%] p-5 gap-4">
                    
                    {/* Header */}
                    <View className="flex-row justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                            Customer Reservations
                        </Text>
                        <TouchableOpacity onPress={onClose} className="p-1">
                            <Text className="text-red-650 font-bold text-base">Close</Text>
                        </TouchableOpacity>
                    </View>

                    {isAdding ? (
                        /* Add Reservation Form */
                        <ScrollView className="flex-1" contentContainerStyle={{ gap: 16 }}>
                            <Text className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                                New Reservation
                            </Text>

                            {errorMsg ? (
                                <Text className="text-red-600 dark:text-red-400 font-semibold text-xs">
                                    {errorMsg}
                                </Text>
                            ) : null}

                            {/* Product Selection */}
                            <View className="gap-1.5">
                                <Text className="text-xs font-bold text-neutral-500">
                                    Product
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 py-1">
                                    {products.map((prod) => {
                                        const isSelected = selectedProductId === prod.id;
                                        return (
                                            <TouchableOpacity
                                                key={prod.id}
                                                onPress={() => setSelectedProductId(prod.id)}
                                                className={`px-3 py-2 rounded-lg border ${isSelected ? 'bg-red-600 border-red-600' : 'border-neutral-300 dark:border-neutral-700 bg-transparent'}`}
                                            >
                                                <Text className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'}`}>
                                                    {prod.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>

                            {/* Customer Name */}
                            <View className="gap-1.5">
                                <Text className="text-xs font-bold text-neutral-500">
                                    Customer Name
                                </Text>
                                <TextInput
                                    value={customerName}
                                    onChangeText={setCustomerName}
                                    placeholder="e.g. John Doe"
                                    placeholderTextColor="#a3a3a3"
                                    className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-850"
                                />
                            </View>

                            {/* Quantity */}
                            <View className="gap-1.5">
                                <Text className="text-xs font-bold text-neutral-500">
                                    Quantity (Units/Packages)
                                </Text>
                                <TextInput
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    keyboardType="decimal-pad"
                                    placeholder="e.g. 2"
                                    placeholderTextColor="#a3a3a3"
                                    className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-850"
                                />
                            </View>

                            {/* Due Date */}
                            <View className="gap-1.5">
                                <Text className="text-xs font-bold text-neutral-500">
                                    Delivery / Pickup Day (Optional)
                                </Text>
                                <TextInput
                                    value={dueDate}
                                    onChangeText={setDueDate}
                                    placeholder="e.g. Friday, June 12th"
                                    placeholderTextColor="#a3a3a3"
                                    className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-850"
                                />
                            </View>

                            {/* Actions */}
                            <View className="flex-row gap-3 mt-4">
                                <TouchableOpacity
                                    onPress={() => setIsAdding(false)}
                                    className="flex-1 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg items-center justify-center"
                                >
                                    <Text className="text-neutral-800 dark:text-neutral-200 font-bold text-sm">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleAddOrder}
                                    className="flex-1 py-3 bg-red-600 rounded-lg items-center justify-center"
                                >
                                    <Text className="text-white font-bold text-sm">Save Reservation</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    ) : (
                        /* Reservations List */
                        <View className="flex-1 gap-4">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm font-semibold text-neutral-500">
                                    Active Reservations ({orders.length})
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (products.length === 0) {
                                            Alert.alert("Error", "Please register a product first.");
                                            return;
                                        }
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
                                    <View className="gap-3 pb-8">
                                        {orders.map((order) => (
                                            <View key={order.id} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 flex-row justify-between items-center">
                                                <View className="flex-1 pr-2">
                                                    <View className="flex-row items-baseline gap-1.5 flex-wrap">
                                                        <Text className="font-bold text-sm text-neutral-850 dark:text-neutral-100">
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
                                                    onPress={() => handleDeleteOrder(order.id)}
                                                    className="p-2 bg-red-100 dark:bg-red-950/40 rounded-lg"
                                                >
                                                    <Text className="text-red-600 dark:text-red-400 font-bold text-xs">Delete</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
