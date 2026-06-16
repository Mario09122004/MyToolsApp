import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Icon, TrashIcon } from '@/components/ui/icon';
import { IngredientInput } from '@/src/hooks/entrepreneurship/useCRUDProducts';

interface IngredientFormCardProps {
    index: number;
    ingredient: IngredientInput;
    onChange: (index: number, field: keyof IngredientInput, value: string) => void;
    onRemove: (index: number) => void;
    onOpenUnitPicker: (index: number) => void;
}

export const IngredientFormCard = ({
    index,
    ingredient,
    onChange,
    onRemove,
    onOpenUnitPicker
}: IngredientFormCardProps) => {
    return (
        <Box className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg gap-2 mb-2">
            <Box className="flex-row justify-between items-center">
                <Text size="xs" className="font-semibold text-neutral-450 dark:text-neutral-500">
                    Ingredient #{index + 1}
                </Text>
                <TouchableOpacity onPress={() => onRemove(index)} className="p-1">
                    <Icon as={TrashIcon} size="sm" className="text-red-600 dark:text-red-400" />
                </TouchableOpacity>
            </Box>
            
            <Input size="sm">
                <InputField
                    type="text"
                    placeholder="Ingredient name (e.g. Flour)"
                    value={ingredient.name}
                    onChangeText={(val) => onChange(index, 'name', val)}
                />
            </Input>
            
            <Box className="flex-row gap-2">
                {/* Quantity */}
                <Box className="flex-1">
                    <Text size="xs" className="mb-1 font-semibold text-neutral-500">Qty</Text>
                    <Input size="sm">
                        <InputField
                            type="text"
                            keyboardType="numeric"
                            placeholder="e.g. 100"
                            value={ingredient.quantity ? ingredient.quantity.toString() : ''}
                            onChangeText={(val) => onChange(index, 'quantity', val)}
                        />
                    </Input>
                </Box>
                
                {/* Unit Dropdown Trigger */}
                <Box className="flex-[1.5]">
                    <Text size="xs" className="mb-1 font-semibold text-neutral-500">Unit</Text>
                    <TouchableOpacity
                        onPress={() => onOpenUnitPicker(index)}
                        className="h-8 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent justify-center px-2 flex-row items-center justify-between"
                    >
                        <Text size="xs" className="text-neutral-850 dark:text-neutral-200 font-medium">
                            {ingredient.unit || 'select'}
                        </Text>
                        <Text size="2xs" className="text-neutral-400">▼</Text>
                    </TouchableOpacity>
                </Box>
                
                {/* Price */}
                <Box className="flex-[1.5]">
                    <Text size="xs" className="mb-1 font-semibold text-neutral-500">Price ($)</Text>
                    <Input size="sm">
                        <InputField
                            type="text"
                            keyboardType="numeric"
                            placeholder="e.g. 1.50"
                            value={ingredient.price !== undefined && ingredient.price !== null ? ingredient.price.toString() : ''}
                            onChangeText={(val) => onChange(index, 'price', val)}
                        />
                    </Input>
                </Box>
            </Box>
        </Box>
    );
};
