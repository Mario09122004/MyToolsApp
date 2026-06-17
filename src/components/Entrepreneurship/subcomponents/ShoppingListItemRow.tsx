import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export interface ConsolidatedIngredient {
    name: string;
    quantity: number;
    unit: string;
    key: string;
}

interface ShoppingListItemRowProps {
    item: ConsolidatedIngredient;
    owned: number;
    isBought: boolean;
    onToggle: () => void;
    onUpdateOwned: (qty: number) => void;
}

export const ShoppingListItemRow = ({
    item,
    owned,
    isBought,
    onToggle,
    onUpdateOwned
}: ShoppingListItemRowProps) => {
    const [inputValue, setInputValue] = useState<string>(owned.toString());

    // Sync input value when owned prop changes (e.g., checkbox toggled or cleared)
    useEffect(() => {
        setInputValue(owned.toString());
    }, [owned]);

    const handleChangeText = (text: string) => {
        // Sanitize input: allow only numbers and a single decimal point
        const sanitized = text.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        setInputValue(sanitized);

        const val = parseFloat(sanitized);
        if (!isNaN(val) && val >= 0) {
            onUpdateOwned(val);
        } else if (sanitized === '') {
            onUpdateOwned(0);
        }
    };

    const handleBlur = () => {
        const val = parseFloat(inputValue);
        if (isNaN(val) || val < 0) {
            setInputValue('0');
            onUpdateOwned(0);
        } else {
            const formatted = parseFloat(val.toFixed(2));
            setInputValue(formatted.toString());
            onUpdateOwned(formatted);
        }
    };

    const displayTarget = parseFloat(item.quantity.toFixed(2));

    return (
        <View className="flex-row items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
                {/* Check Button (Checkbox) */}
                <TouchableOpacity 
                    onPress={onToggle}
                    activeOpacity={0.7}
                    className={`w-6 h-6 rounded-md border items-center justify-center ${isBought ? 'bg-red-600 border-red-600' : 'border-neutral-300 dark:border-neutral-700 bg-transparent'}`}
                >
                    {isBought && (
                        <Text className="text-white font-bold text-xs">✓</Text>
                    )}
                </TouchableOpacity>

                <Text className={`font-semibold text-sm flex-1 ${isBought ? 'line-through text-typography-400 font-normal' : 'text-typography-800'}`}>
                    {item.name}
                </Text>
            </View>
            
            {/* Input field & Target quantity */}
            <View className="flex-row items-center gap-2">
                <TextInput
                    value={inputValue}
                    onChangeText={handleChangeText}
                    onBlur={handleBlur}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                    className={`w-16 h-8 text-center border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-xs font-bold text-black dark:text-neutral-100 p-0 ${isBought ? 'line-through text-typography-400 font-normal' : ''}`}
                />
                <Text className={`font-bold text-xs min-w-[50px] text-neutral-500 ${isBought ? 'line-through text-typography-400 font-normal' : ''}`}>
                    / {displayTarget} {item.unit}
                </Text>
            </View>
        </View>
    );
};
