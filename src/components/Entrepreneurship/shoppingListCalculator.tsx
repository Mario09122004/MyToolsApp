import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { ProductWithIngredients } from '@/src/hooks/entrepreneurship/useCRUDProducts';
import { useShoppingListStore } from '@/src/helpers/shopping_list_store';

interface ShoppingListCalculatorProps {
    products: ProductWithIngredients[];
}

interface ConsolidatedIngredient {
    name: string;
    quantity: number;
    unit: string;
    key: string; // "name-unit"
}

// Get dynamic step size for partial purchases based on unit and amount needed
const getStep = (quantity: number, unit: string) => {
    const u = (unit || '').trim().toLowerCase();
    if (u === 'kg' || u === 'kg.' || u === 'kilo' || u === 'kilos' || u === 'l' || u === 'liter' || u === 'liters' || u === 'lt' || u === 'lts') {
        return quantity <= 2 ? 0.1 : 0.5;
    }
    if (u === 'gm' || u === 'g' || u === 'gr' || u === 'grams' || u === 'ml') {
        return quantity >= 500 ? 50 : 10;
    }
    return 1;
};

export const ShoppingListCalculator = ({ products }: ShoppingListCalculatorProps) => {
    const {
        plan,
        ownedIngredients,
        incrementPlanQty,
        decrementPlanQty,
        incrementOwnedQty,
        decrementOwnedQty,
        setOwnedQty,
        resetPlan
    } = useShoppingListStore();

    console.log("[ShoppingListCalculator] Rendering. Products count:", products.length, "Plan:", JSON.stringify(plan));

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

    const toggleBought = (key: string, targetQty: number) => {
        const current = ownedIngredients[key] || 0;
        if (current >= targetQty) {
            setOwnedQty(key, 0);
        } else {
            setOwnedQty(key, targetQty);
        }
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
                                                onPress={() => decrementPlanQty(product.id)}
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
                                                onPress={() => incrementPlanQty(product.id)}
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
                            onPress={resetPlan}
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
                                const owned = ownedIngredients[item.key] || 0;
                                const isBought = owned >= item.quantity;
                                const step = getStep(item.quantity, item.unit);

                                // Format float representation to display cleanly
                                const displayOwned = parseFloat(owned.toFixed(2));
                                const displayTarget = parseFloat(item.quantity.toFixed(2));

                                return (
                                    <View 
                                        key={item.key} 
                                        className="flex-row items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800"
                                    >
                                        <View className="flex-row items-center gap-3 flex-1 pr-2">
                                            
                                            {/* Check Button (Checkbox) */}
                                            <TouchableOpacity 
                                                onPress={() => toggleBought(item.key, item.quantity)}
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
                                        
                                        {/* Steppers & Quantity Info */}
                                        <View className="flex-row items-center gap-2">
                                            <TouchableOpacity 
                                                onPress={() => decrementOwnedQty(item.key, step)}
                                                disabled={owned <= 0}
                                                className={`w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-850 items-center justify-center ${owned <= 0 ? 'opacity-40' : ''}`}
                                            >
                                                <Text className="font-bold text-xs text-neutral-800 dark:text-neutral-200">-</Text>
                                            </TouchableOpacity>

                                            <Text className={`font-bold text-xs text-center min-w-[70px] ${isBought ? 'line-through text-typography-400 font-normal' : 'text-neutral-800 dark:text-neutral-200'}`}>
                                                {displayOwned} / {displayTarget} {item.unit}
                                            </Text>

                                            <TouchableOpacity 
                                                onPress={() => incrementOwnedQty(item.key, step, item.quantity)}
                                                disabled={owned >= item.quantity}
                                                className={`w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-850 items-center justify-center ${owned >= item.quantity ? 'opacity-40' : ''}`}
                                            >
                                                <Text className="font-bold text-xs text-neutral-800 dark:text-neutral-200">+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};
