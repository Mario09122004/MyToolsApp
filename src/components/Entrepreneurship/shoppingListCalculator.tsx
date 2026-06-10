import React, { useState, useMemo } from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { ProductWithIngredients } from '@/src/hooks/entrepreneurship/useCRUDProducts';

interface ShoppingListCalculatorProps {
    products: ProductWithIngredients[];
}

interface ProductionPlan {
    [productId: number]: number; // productId -> quantity of recipes/batches
}

interface ConsolidatedIngredient {
    name: string;
    quantity: number;
    unit: string;
    key: string; // "name-unit"
}

export const ShoppingListCalculator = ({ products }: ShoppingListCalculatorProps) => {
    const [plan, setPlan] = useState<ProductionPlan>({});
    const [boughtIngredients, setBoughtIngredients] = useState<{ [key: string]: boolean }>({});

    console.log("[ShoppingListCalculator] Rendering. Products:", JSON.stringify(products), "Plan:", JSON.stringify(plan));

    // Handle updating quantity
    const handleQtyChange = (productId: number, qtyStr: string) => {
        const num = parseFloat(qtyStr);
        setPlan(prev => ({
            ...prev,
            [productId]: isNaN(num) || num < 0 ? 0 : num
        }));
    };

    const handleIncrement = (productId: number) => {
        const current = plan[productId] || 0;
        setPlan(prev => ({
            ...prev,
            [productId]: current + 1
        }));
    };

    const handleDecrement = (productId: number) => {
        const current = plan[productId] || 0;
        if (current > 0) {
            setPlan(prev => ({
                ...prev,
                [productId]: Math.max(0, current - 1)
            }));
        }
    };

    // Reset plan
    const handleReset = () => {
        setPlan({});
        setBoughtIngredients({});
    };

    // Calculate consolidated list
    const consolidatedList = useMemo((): ConsolidatedIngredient[] => {
        try {
            const totals: { [key: string]: { name: string; quantity: number; unit: string } } = {};

            Object.entries(plan).forEach(([prodIdStr, batchQty]) => {
                if (batchQty <= 0) return;
                const prodId = parseInt(prodIdStr);
                const product = products.find(p => p.id === prodId);
                if (!product) return;

                const ingredients = product.ingredients || [];
                ingredients.forEach(ing => {
                    if (!ing) return;
                    
                    const nameRaw = ing.name || 'Unnamed Ingredient';
                    const unitRaw = ing.unit || 'units';
                    const qtyRaw = typeof ing.quantity === 'number' ? ing.quantity : 0;
                    
                    const nameClean = nameRaw.trim().toLowerCase();
                    const unitClean = unitRaw.trim().toLowerCase();
                    const displayName = nameRaw.trim();
                    const displayUnit = unitRaw.trim();
                    const key = `${nameClean}-${unitClean}`;

                    if (totals[key]) {
                        totals[key].quantity += qtyRaw * batchQty;
                    } else {
                        totals[key] = {
                            name: displayName,
                            quantity: qtyRaw * batchQty,
                            unit: displayUnit
                        };
                    }
                });
            });

            return Object.values(totals).map(item => ({
                ...item,
                key: `${(item.name || '').toLowerCase()}-${(item.unit || '').toLowerCase()}`
            })).sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error("Error calculating consolidated list:", error);
            return [];
        }
    }, [plan, products]);

    const toggleBought = (key: string) => {
        setBoughtIngredients(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="p-4 gap-6">
                
                {/* Header info */}
                <View className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl">
                    <Text className="text-typography-900 font-bold text-lg mb-1">
                        Batch Planner
                    </Text>
                    <Text className="text-typography-500 text-xs">
                        Specify how many recipe batches you plan to prepare. The app will calculate the consolidated shopping list.
                    </Text>
                </View>

                {/* Products Planner List */}
                <View>
                    <Text className="text-typography-900 font-bold text-lg mb-3">
                        Select Recipes & Batches
                    </Text>
                    {products.length === 0 ? (
                        <View className="py-6 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl items-center justify-center">
                            <Text className="text-typography-400 text-sm">No products registered yet</Text>
                        </View>
                    ) : (
                        <View className="gap-3">
                            {products.map((product) => {
                                const qty = plan[product.id] || 0;
                                return (
                                    <View key={product.id} className="flex-row items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
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
                                                onPress={() => handleDecrement(product.id)}
                                                className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
                                            >
                                                <Text className="font-bold text-neutral-800 dark:text-neutral-200">-</Text>
                                            </TouchableOpacity>
 
                                            <View className="w-12 h-8 items-center justify-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                                <Text className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                                                    {qty}
                                                </Text>
                                            </View>
 
                                            <TouchableOpacity 
                                                onPress={() => handleIncrement(product.id)}
                                                className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
                                            >
                                                <Text className="font-bold text-neutral-800 dark:text-neutral-200">+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>

                {consolidatedList.length > 0 && (
                    <View className="flex-row justify-end">
                        <TouchableOpacity 
                            onPress={handleReset}
                            className="border border-red-600 px-3 py-1.5 rounded-lg active:bg-neutral-50 dark:active:bg-neutral-850"
                        >
                            <Text className="text-red-600 dark:text-red-400 font-bold text-xs">Clear Plan</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-2" />

                {/* Generated Shopping List Section */}
                <View className="pb-12">
                    <Text className="text-typography-900 font-bold text-lg mb-3">
                        Shopping List
                    </Text>

                    {consolidatedList.length === 0 ? (
                        <View className="py-10 bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl items-center justify-center">
                            <Text className="text-typography-500 text-center font-medium text-sm">
                                Plan is empty
                            </Text>
                            <Text className="text-typography-400 text-center mt-1 text-xs">
                                Adjust recipe batch counts above to generate shopping list.
                            </Text>
                        </View>
                    ) : (
                        <View className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 gap-3">
                            {consolidatedList.map((item) => {
                                const isBought = !!boughtIngredients[item.key];
                                return (
                                    <TouchableOpacity 
                                        key={item.key} 
                                        onPress={() => toggleBought(item.key)}
                                        activeOpacity={0.7}
                                    >
                                        <View className="flex-row items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                                            <View className="flex-row items-center gap-3 flex-1 pr-2">
                                                
                                                {/* Check Button (Checkbox) */}
                                                <View className={`w-6 h-6 rounded-md border items-center justify-center ${isBought ? 'bg-red-600 border-red-600' : 'border-neutral-300 dark:border-neutral-700 bg-transparent'}`}>
                                                    {isBought && (
                                                        <Text className="text-white font-bold text-xs">✓</Text>
                                                    )}
                                                </View>

                                                <Text className={`font-semibold text-sm ${isBought ? 'line-through text-typography-400 font-normal' : 'text-typography-800'}`}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                            
                                            <Text className={`font-bold text-sm ${isBought ? 'line-through text-typography-400 font-normal' : 'text-red-600 dark:text-red-500'}`}>
                                                {item.quantity} {item.unit}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};
