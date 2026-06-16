import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { ProductWithIngredients } from '@/src/hooks/entrepreneurship/useCRUDProducts';
import { OrderInput } from '@/src/hooks/entrepreneurship/useCRUDOrders';

interface ReservationFormProps {
    products: ProductWithIngredients[];
    onCancel: () => void;
    onSave: (order: OrderInput) => Promise<void>;
}

export const ReservationForm = ({
    products,
    onCancel,
    onSave
}: ReservationFormProps) => {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueDateObj, setDueDateObj] = useState<Date>(new Date());
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (products.length > 0 && selectedProductId === null) {
            setSelectedProductId(products[0].id);
        }
    }, [products]);

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
            await onSave(newOrder);
        } catch (err) {
            console.error("Error saving reservation:", err);
            setErrorMsg("Failed to save reservation");
        }
    };

    return (
        <ScrollView className="flex-1" contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
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
                    className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-800"
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
                    className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-800"
                />
            </View>

            {/* Due Date */}
            <View className="gap-1.5">
                <Text className="text-xs font-bold text-neutral-500">
                    Delivery / Pickup Day (Optional)
                </Text>
                <View className="flex-row gap-2 items-center">
                    <TouchableOpacity 
                        onPress={() => setDatePickerOpen(true)}
                        className="flex-1 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2.5 bg-neutral-50 dark:bg-neutral-800 flex-row justify-between items-center"
                    >
                        <Text className={`text-sm ${dueDate ? 'text-neutral-900 dark:text-neutral-50' : 'text-neutral-400'}`}>
                            {dueDate ? dueDate : "Select Date"}
                        </Text>
                    </TouchableOpacity>
                    {dueDate ? (
                        <TouchableOpacity 
                            onPress={() => {
                                setDueDate('');
                                setDueDateObj(new Date());
                            }}
                            className="px-3 py-2.5 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 rounded-lg"
                        >
                            <Text className="text-xs font-bold text-red-600 dark:text-red-400">Clear</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
                <DatePicker
                    modal
                    open={datePickerOpen}
                    date={dueDateObj}
                    mode="date"
                    onConfirm={(selectedDate) => {
                        setDatePickerOpen(false);
                        setDueDateObj(selectedDate);
                        setDueDate(selectedDate.toLocaleDateString());
                    }}
                    onCancel={() => {
                        setDatePickerOpen(false);
                    }}
                />
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mt-4 pb-12">
                <TouchableOpacity
                    onPress={onCancel}
                    className="flex-1 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg items-center justify-center bg-white dark:bg-neutral-900"
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
    );
};
