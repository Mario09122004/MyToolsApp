import React, { useState, useMemo } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
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
            <Box className="p-4 gap-6">
                
                {/* Header info */}
                <Box className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl">
                    <Heading size="sm" className="text-typography-900 font-bold mb-1">
                        Batch Planner
                    </Heading>
                    <Text size="xs" className="text-typography-500">
                        Specify how many recipe batches you plan to prepare. The app will calculate the consolidated shopping list.
                    </Text>
                </Box>

                {/* Products Planner List */}
                <Box>
                    <Heading size="md" className="text-typography-900 font-bold mb-3">
                        Select Recipes & Batches
                    </Heading>
                    {products.length === 0 ? (
                        <Box className="py-6 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl items-center justify-center">
                            <Text size="sm" className="text-typography-400">No products registered yet</Text>
                        </Box>
                    ) : (
                        <Box className="gap-3">
                            {products.map((product) => {
                                const qty = plan[product.id] || 0;
                                return (
                                    <Box key={product.id} className="flex-row items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                                        <Box className="flex-1 pr-2">
                                            <Text size="sm" className="font-bold text-typography-900">
                                                {product.name}
                                            </Text>
                                            <Text size="xs" className="text-typography-400">
                                                Yields {product.yieldAmount} {product.yieldUnit}
                                            </Text>
                                        </Box>
                                        
                                        {/* Counter Controls */}
                                        <Box className="flex-row items-center gap-1">
                                            <TouchableOpacity 
                                                onPress={() => handleDecrement(product.id)}
                                                className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
                                            >
                                                <Text className="font-bold text-neutral-800 dark:text-neutral-200">-</Text>
                                            </TouchableOpacity>
 
                                            <Box className="w-12 h-8 items-center justify-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                                <Text size="sm" className="font-bold text-neutral-800 dark:text-neutral-200">
                                                    {qty}
                                                </Text>
                                            </Box>
 
                                            <TouchableOpacity 
                                                onPress={() => handleIncrement(product.id)}
                                                className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
                                            >
                                                <Text className="font-bold text-neutral-800 dark:text-neutral-200">+</Text>
                                            </TouchableOpacity>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Box>

                {consolidatedList.length > 0 && (
                    <Box className="flex-row justify-end">
                        <TouchableOpacity 
                            onPress={handleReset}
                            className="border border-red-600 px-3 py-1.5 rounded-lg active:bg-neutral-50 dark:active:bg-neutral-850"
                        >
                            <Text size="xs" className="text-red-600 dark:text-red-400 font-bold">Clear Plan</Text>
                        </TouchableOpacity>
                    </Box>
                )}

                <Divider className="my-2" />

                {/* Generated Shopping List Section */}
                <Box className="pb-12">
                    <Heading size="md" className="text-typography-900 font-bold mb-3">
                        Shopping List
                    </Heading>

                    {consolidatedList.length === 0 ? (
                        <Box className="py-10 bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl items-center justify-center">
                            <Text size="sm" className="text-typography-500 text-center font-medium">
                                Plan is empty
                            </Text>
                            <Text size="xs" className="text-typography-400 text-center mt-1">
                                Adjust recipe batch counts above to generate shopping list.
                            </Text>
                        </Box>
                    ) : (
                        <Box className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm gap-3">
                            {consolidatedList.map((item) => {
                                const isBought = !!boughtIngredients[item.key];
                                return (
                                    <TouchableOpacity 
                                        key={item.key} 
                                        onPress={() => toggleBought(item.key)}
                                        activeOpacity={0.7}
                                    >
                                        <Box className="flex-row items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                                            <Box className="flex-row items-center gap-3 flex-1 pr-2">
                                                
                                                {/* Check Button (Checkbox) */}
                                                <Box className={`w-6 h-6 rounded-md border items-center justify-center ${isBought ? 'bg-red-600 border-red-600' : 'border-neutral-300 dark:border-neutral-700 bg-transparent'}`}>
                                                    {isBought && (
                                                        <Text className="text-white font-bold text-xs">✓</Text>
                                                    )}
                                                </Box>

                                                <Text size="md" className={`font-semibold ${isBought ? 'line-through text-typography-400 font-normal' : 'text-typography-800'}`}>
                                                    {item.name}
                                                </Text>
                                            </Box>
                                            
                                            <Text size="md" className={`font-bold ${isBought ? 'line-through text-typography-400 font-normal' : 'text-red-600 dark:text-red-500'}`}>
                                                {item.quantity} {item.unit}
                                            </Text>
                                        </Box>
                                    </TouchableOpacity>
                                );
                            })}
                        </Box>
                    )}
                </Box>
            </Box>
        </ScrollView>
    );
};
