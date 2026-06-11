import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity, View, Text, TextInput } from 'react-native';
import { ProductWithIngredients } from '@/src/hooks/entrepreneurship/useCRUDProducts';
import { useShoppingListStore } from '@/src/helpers/shopping_list_store';
import { OrderWithProduct } from '@/src/hooks/entrepreneurship/useCRUDOrders';

interface ShoppingListCalculatorProps {
    products: ProductWithIngredients[];
    orders: OrderWithProduct[];
}

interface ConsolidatedIngredient {
    name: string;
    quantity: number;
    unit: string;
    key: string; // "name-unit"
}

// Individual row item component to prevent whole list re-renders on every keystroke
interface ShoppingListItemRowProps {
    item: ConsolidatedIngredient;
    owned: number;
    isBought: boolean;
    onToggle: () => void;
    onUpdateOwned: (qty: number) => void;
}

const ShoppingListItemRow = ({ item, owned, isBought, onToggle, onUpdateOwned }: ShoppingListItemRowProps) => {
    const [inputValue, setInputValue] = React.useState<string>(owned.toString());

    // Sync input value when owned prop changes (e.g., checkbox toggled or cleared)
    React.useEffect(() => {
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

export const ShoppingListCalculator = ({ products, orders }: ShoppingListCalculatorProps) => {
    const {
        plan,
        ownedIngredients,
        incrementPlanQty,
        decrementPlanQty,
        setPlanQty,
        setOwnedQty,
        resetPlan
    } = useShoppingListStore();

    // console.log("[ShoppingListCalculator] Rendering. Products count:", products.length, "Plan:", JSON.stringify(plan));

    // Calculate pre-order batch requirements per product
    const preOrderRequirements = useMemo(() => {
        const reqs: { [productId: number]: { quantity: number; batches: number } } = {};
        
        orders.forEach(order => {
            const prod = products.find(p => p.id === order.productId);
            if (!prod) return;
            
            if (!reqs[prod.id]) {
                reqs[prod.id] = { quantity: 0, batches: 0 };
            }
            reqs[prod.id].quantity += order.quantity;
        });

        Object.entries(reqs).forEach(([prodIdStr, req]) => {
            const prodId = parseInt(prodIdStr);
            const prod = products.find(p => p.id === prodId);
            if (prod) {
                req.batches = Math.ceil(req.quantity / (prod.yieldAmount || 1));
            }
        });

        return reqs;
    }, [orders, products]);

    // Check if the plan is short of the pre-order requirements
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
                                const req = preOrderRequirements[product.id];
                                const reqBatches = req ? req.batches : 0;
                                const reqQty = req ? req.quantity : 0;
                                const isCovered = qty >= reqBatches;

                                return (
                                    <View key={product.id} className="bg-white dark:bg-neutral-900 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
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
                                                    onPress={() => decrementPlanQty(product.id)}
                                                    disabled={qty <= 0}
                                                    className={`w-8 h-8 rounded-lg items-center justify-center ${qty <= 0 ? 'bg-neutral-50 dark:bg-neutral-900 opacity-40' : 'bg-neutral-100 dark:bg-neutral-800'}`}
                                                >
                                                    <Text className={`font-bold ${qty <= 0 ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-800 dark:text-neutral-200'}`}>-</Text>
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
                            })}
                        </View>
                    )}
                </View>

                {consolidatedList.length > 0 && (
                    <View className="flex-row justify-end">
                        <TouchableOpacity 
                            onPress={resetPlan}
                            className="border border-red-650 px-3 py-1.5 rounded-lg active:bg-neutral-50 dark:active:bg-neutral-800"
                        >
                            <Text className="text-red-605 dark:text-red-400 font-bold text-xs">Clear Plan</Text>
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
                                return (
                                    <ShoppingListItemRow
                                        key={item.key}
                                        item={item}
                                        owned={owned}
                                        isBought={isBought}
                                        onToggle={() => toggleBought(item.key, item.quantity)}
                                        onUpdateOwned={(qty) => setOwnedQty(item.key, qty)}
                                    />
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};
