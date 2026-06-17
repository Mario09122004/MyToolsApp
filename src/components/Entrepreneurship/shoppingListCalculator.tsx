import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { ProductWithIngredients } from '@/src/hooks/entrepreneurship/useCRUDProducts';
import { useShoppingListStore } from '@/src/helpers/shopping_list_store';
import { OrderWithProduct } from '@/src/hooks/entrepreneurship/useCRUDOrders';
import { ShoppingListItemRow, ConsolidatedIngredient } from './subcomponents/ShoppingListItemRow';
import { ProductPlannerItemRow } from './subcomponents/ProductPlannerItemRow';

interface ShoppingListCalculatorProps {
    products: ProductWithIngredients[];
    orders: OrderWithProduct[];
}

export const ShoppingListCalculator = ({ products, orders }: ShoppingListCalculatorProps) => {
    const {
        plan,
        ownedIngredients,
        incrementPlanQty,
        decrementPlanQty,
        setOwnedQty,
        resetPlan
    } = useShoppingListStore();

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

                                return (
                                    <ProductPlannerItemRow
                                        key={product.id}
                                        product={product}
                                        quantity={qty}
                                        reqQty={reqQty}
                                        reqBatches={reqBatches}
                                        onIncrement={() => incrementPlanQty(product.id)}
                                        onDecrement={() => decrementPlanQty(product.id)}
                                    />
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
