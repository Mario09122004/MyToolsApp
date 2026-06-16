import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Divider } from '@/components/ui/divider';
import { Icon, TrashIcon, EditIcon } from '@/components/ui/icon';
import { Pressable, TouchableOpacity } from 'react-native';
import { ProductWithIngredients } from '@/src/hooks/entrepreneurship/useCRUDProducts';

interface ProductItemProps {
    product: ProductWithIngredients;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    reservedQuantity?: number;
    reservedOrdersCount?: number;
}

export const ProductItem = ({ product, onEdit, onDelete, reservedQuantity = 0, reservedOrdersCount = 0 }: ProductItemProps) => {
    const [expanded, setExpanded] = useState(false);

    // Calculate batches needed
    const batchesNeeded = Math.ceil(reservedQuantity / (product.yieldAmount || 1));

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(product.pricePerUnit);

    // Format yield text
    const yieldText = `${product.yieldAmount} ${product.yieldUnit}`;
    const subYieldText = product.subYieldAmount && product.subYieldUnit
        ? ` (${product.subYieldAmount} ${product.subYieldUnit} each)`
        : '';

    return (
        <Card size="md" variant="outline" className="p-4 rounded-xl mb-3 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <Pressable onPress={() => setExpanded(!expanded)}>
                <Box className="flex-row justify-between items-start">
                    <Box className="flex-1 pr-4">
                        <Heading size="md" className="text-typography-900 font-bold">
                            {product.name}
                        </Heading>
                        {product.description ? (
                            <Text size="sm" className="text-typography-500 mt-1" numberOfLines={expanded ? undefined : 2}>
                                {product.description}
                            </Text>
                        ) : null}
                        {reservedQuantity > 0 ? (
                            <Box className="mt-2 flex-row items-center gap-1.5 flex-wrap">
                                <Text size="xs" className="text-red-650 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/25 px-2 py-0.5 rounded border border-red-200/50 dark:border-red-900/30">
                                    ★ {reservedQuantity} reserved
                                </Text>
                                <Text size="xs" className="text-neutral-800 dark:text-neutral-200 font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                    Needs {batchesNeeded} {batchesNeeded === 1 ? 'batch' : 'batches'}
                                </Text>
                            </Box>
                        ) : null}
                    </Box>
                    <Box className="items-end">
                        <Text size="lg" className="font-extrabold text-red-600 dark:text-red-500">
                            {formattedPrice}
                        </Text>
                        <Text size="xs" className="text-typography-400 mt-1">
                            per unit
                        </Text>
                    </Box>
                </Box>

                <Box className="mt-3 flex-row justify-between items-center bg-neutral-50 dark:bg-neutral-950 p-2 rounded-lg">
                    <Text size="xs" className="text-typography-600 font-semibold flex-1 pr-2">
                        Yields: <Text size="xs" className="font-bold text-neutral-800 dark:text-neutral-200">{yieldText}{subYieldText}</Text>
                    </Text>
                    <Text size="xs" className="text-red-600 dark:text-red-400 font-bold">
                        {expanded ? 'Hide Recipe' : 'View Recipe'}
                    </Text>
                </Box>

                {expanded && (
                    <Box className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <Heading size="xs" className="text-typography-900 font-bold mb-2">
                            Recipe Materials / Ingredients:
                        </Heading>
                        {product.ingredients.length === 0 ? (
                            <Text size="xs" className="text-typography-400 italic">
                                No ingredients specified for this recipe.
                            </Text>
                        ) : (
                            <Box className="gap-1.5 pl-1 mb-3">
                                {product.ingredients.map((ing) => {
                                    if (!ing) return null;
                                    const formattedIngPrice = ing.price !== null && ing.price !== undefined
                                        ? new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(ing.price)
                                        : '$0.00';

                                    return (
                                        <Box key={ing.id} className="flex-row justify-between items-center py-0.5">
                                            <Text size="sm" className="text-typography-700 font-medium">
                                                • {ing.name || 'Unnamed Ingredient'} ({ing.quantity ?? 0} {ing.unit || 'units'})
                                            </Text>
                                            <Text size="sm" className="text-typography-800 dark:text-neutral-200 font-bold">
                                                {formattedIngPrice}
                                            </Text>
                                        </Box>
                                    );
                                })}
                                <Divider className="my-2" />
                                <Box className="flex-row justify-between items-center">
                                    <Text size="sm" className="text-typography-900 font-bold">
                                        Total Ingredients Cost:
                                    </Text>
                                    <Text size="sm" className="text-red-650 dark:text-red-500 font-extrabold">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(product.ingredients.reduce((sum, ing) => sum + (ing?.price || 0), 0))}
                                    </Text>
                                </Box>
                            </Box>
                        )}
                        
                        <Divider className="my-3" />

                        <Box className="flex-row justify-end gap-3">
                            <TouchableOpacity 
                                onPress={() => onEdit(product.id)}
                                className="flex-row items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg"
                            >
                                <Icon as={EditIcon} size="xs" className="text-neutral-700 dark:text-neutral-300" />
                                <Text size="xs" className="font-bold text-neutral-700 dark:text-neutral-300">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => onDelete(product.id)}
                                className="flex-row items-center gap-1 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-lg"
                            >
                                <Icon as={TrashIcon} size="xs" className="text-red-600 dark:text-red-400" />
                                <Text size="xs" className="font-bold text-red-600 dark:text-red-400">Delete</Text>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                )}
            </Pressable>
        </Card>
    );
};
