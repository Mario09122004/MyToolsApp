import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
import { AlertCircleIcon } from '@/components/ui/icon';
import { useCRUDProducts, IngredientInput, ProductInput } from '@/src/hooks/entrepreneurship/useCRUDProducts';
import { IngredientFormCard } from './subcomponents/IngredientFormCard';
import { UnitPickerModal } from './subcomponents/UnitPickerModal';
import { MaterialPickerModal } from './subcomponents/MaterialPickerModal';
import { Material } from '@/db/schema';

interface FormProductProps {
    editMode: boolean;
    productId?: number;
    onSave?: () => void;
    onClose?: () => void;
}

export const FormProduct = ({
    editMode,
    productId = 0,
    onSave,
    onClose
}: FormProductProps) => {
    const { saveProductWithIngredients, queryProductById, queryMaterials } = useCRUDProducts();
    
    // Form States
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [yieldAmount, setYieldAmount] = useState('1');
    const [yieldUnit, setYieldUnit] = useState('packages');
    const [subYieldAmount, setSubYieldAmount] = useState('');
    const [subYieldUnit, setSubYieldUnit] = useState('');
    
    // Ingredients
    const [ingredients, setIngredients] = useState<IngredientInput[]>([]);
    
    // Materials registered in DB
    const [materials, setMaterials] = useState<Material[]>([]);

    // Errors
    const [nameError, setNameError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [yieldError, setYieldError] = useState(false);

    // Unit Picker Modal State
    const [activeIngredientIdx, setActiveIngredientIdx] = useState<number | null>(null);
    const [unitPickerOpen, setUnitPickerOpen] = useState(false);

    // Material Picker Modal State
    const [activeMaterialIngredientIdx, setActiveMaterialIngredientIdx] = useState<number | null>(null);
    const [materialPickerOpen, setMaterialPickerOpen] = useState(false);

    const UNIT_OPTIONS = ['unit', 'gr', 'Kg', 'ml', 'L', 'cup', 'spoonful'];

    useEffect(() => {
        const loadFormAndMaterials = async () => {
            const mats = await queryMaterials();
            setMaterials(mats);

            if (editMode && productId > 0) {
                const prod = await queryProductById(productId);
                if (prod) {
                    setName(prod.name);
                    setDescription(prod.description || '');
                    setPricePerUnit(prod.pricePerUnit.toString());
                    setYieldAmount(prod.yieldAmount.toString());
                    setYieldUnit(prod.yieldUnit);
                    setSubYieldAmount(prod.subYieldAmount?.toString() || '');
                    setSubYieldUnit(prod.subYieldUnit || '');
                    
                    setIngredients(prod.ingredients.map(ing => {
                        const hasMatchingMaterial = mats.some(m => m.name.toLowerCase() === ing.name.toLowerCase());
                        return {
                            name: ing.name,
                            quantity: ing.quantity,
                            unit: ing.unit,
                            price: ing.price,
                            isOther: !hasMatchingMaterial
                        };
                    }));
                }
            } else {
                // Reset form
                setName('');
                setDescription('');
                setPricePerUnit('');
                setYieldAmount('1');
                setYieldUnit('packages');
                setSubYieldAmount('');
                setSubYieldUnit('');
                setIngredients([]);
            }
        };

        loadFormAndMaterials();
    }, [editMode, productId]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: 1, unit: 'unit', price: null, isOther: false }]);
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (index: number, field: keyof IngredientInput, value: any) => {
        const updated = [...ingredients];
        if (field === 'quantity') {
            const num = parseFloat(value);
            updated[index] = {
                ...updated[index],
                quantity: isNaN(num) ? 0 : num
            };
        } else if (field === 'price') {
            const num = parseFloat(value);
            updated[index] = {
                ...updated[index],
                price: isNaN(num) ? null : num
            };
        } else {
            updated[index] = {
                ...updated[index],
                [field]: value
            };
        }
        setIngredients(updated);
    };

    const handleMaterialSelect = (materialName: string, unit: string, isOther: boolean) => {
        if (activeMaterialIngredientIdx !== null) {
            const updated = [...ingredients];
            updated[activeMaterialIngredientIdx] = {
                ...updated[activeMaterialIngredientIdx],
                name: materialName,
                unit: unit,
                isOther
            };
            setIngredients(updated);
        }
    };

    const handleSave = async () => {
        let hasError = false;
        if (!name.trim()) {
            setNameError(true);
            hasError = true;
        } else {
            setNameError(false);
        }

        let priceNum = 0;
        if (pricePerUnit.trim()) {
            priceNum = parseFloat(pricePerUnit);
            if (isNaN(priceNum) || priceNum < 0) {
                setPriceError(true);
                hasError = true;
            } else {
                setPriceError(false);
            }
        } else {
            setPriceError(false);
        }

        let yieldNum = 1;
        if (yieldAmount.trim()) {
            yieldNum = parseFloat(yieldAmount);
            if (isNaN(yieldNum) || yieldNum <= 0) {
                setYieldError(true);
                hasError = true;
            } else {
                setYieldError(false);
            }
        } else {
            setYieldError(false);
        }

        if (hasError) return;

        // Clean ingredients: remove empty names
        const cleanIngredients = ingredients.filter(ing => ing.name.trim() !== '');

        const productData: ProductInput = {
            id: editMode ? productId : undefined,
            name: name.trim(),
            description: description.trim() || null,
            pricePerUnit: priceNum,
            yieldAmount: yieldNum,
            yieldUnit: yieldUnit.trim() || 'units',
            subYieldAmount: subYieldAmount.trim() ? parseFloat(subYieldAmount) : null,
            subYieldUnit: subYieldUnit.trim() || null
        };

        try {
            await saveProductWithIngredients(productData, cleanIngredients);
            if (onSave) onSave();
            if (onClose) onClose();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <ScrollView className="max-h-[500px]" showsVerticalScrollIndicator={true}>
            <Box className="gap-4 pb-6 px-1">
                {/* Product Name */}
                <FormControl isInvalid={nameError}>
                    <FormControlLabel>
                        <FormControlLabelText className="font-semibold text-typography-700">Product Name *</FormControlLabelText>
                    </FormControlLabel>
                    <Input size="md" className="mt-1">
                        <InputField
                            type="text"
                            placeholder="e.g. Chocolate Cookies"
                            value={name}
                            onChangeText={setName}
                        />
                    </Input>
                    {nameError && (
                        <FormControlError className="mt-1">
                            <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                            <FormControlErrorText className="text-red-500">Name is required.</FormControlErrorText>
                        </FormControlError>
                    )}
                </FormControl>

                {/* Description */}
                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText className="font-semibold text-typography-700">Description</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea size="md" className="mt-1">
                        <TextareaInput
                            placeholder="Brief description of the product"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </Textarea>
                </FormControl>

                <Box className="flex-row gap-4">
                    {/* Price unit */}
                    <Box className="flex-1">
                        <FormControl isInvalid={priceError}>
                            <FormControlLabel>
                                <FormControlLabelText className="font-semibold text-typography-700">Price unit</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="md" className="mt-1">
                                <InputField
                                    type="text"
                                    keyboardType="numeric"
                                    placeholder="e.g. 10.50"
                                    value={pricePerUnit}
                                    onChangeText={setPricePerUnit}
                                />
                            </Input>
                            {priceError && (
                                <FormControlError className="mt-1">
                                    <FormControlErrorText className="text-red-500">Enter a valid price.</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>
                    </Box>
                </Box>

                <Divider className="my-2" />

                {/* Yield details */}
                <Heading size="sm" className="text-typography-900 font-bold">Recipe Yield</Heading>
                <Text size="xs" className="text-typography-500">
                    How much product does one batch of this recipe produce?
                </Text>

                <Box className="flex-row gap-2 items-end">
                    <Box className="flex-[2]">
                        <FormControl isInvalid={yieldError}>
                            <FormControlLabel>
                                <FormControlLabelText className="font-semibold text-typography-700">Yield QT</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="md" className="mt-1">
                                <InputField
                                    type="text"
                                    keyboardType="numeric"
                                    placeholder="e.g. 8"
                                    value={yieldAmount}
                                    onChangeText={setYieldAmount}
                                />
                            </Input>
                        </FormControl>
                    </Box>
                    <Box className="flex-[3]">
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="font-semibold text-typography-700">Yield unit</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="md" className="mt-1">
                                <InputField
                                    type="text"
                                    placeholder="e.g. packages"
                                    value={yieldUnit}
                                    onChangeText={setYieldUnit}
                                />
                            </Input>
                        </FormControl>
                    </Box>
                </Box>
                {yieldError && (
                    <Text size="xs" className="text-red-500">Yield amount must be greater than 0.</Text>
                )}

                {/* Optional sub-yield details */}
                <Box className="flex-row gap-2 items-end">
                    <Box className="flex-[2]">
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="font-semibold text-typography-700">Sub-yield Qty</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="md" className="mt-1">
                                <InputField
                                    type="text"
                                    keyboardType="numeric"
                                    placeholder="e.g. 10"
                                    value={subYieldAmount}
                                    onChangeText={setSubYieldAmount}
                                />
                            </Input>
                        </FormControl>
                    </Box>
                    <Box className="flex-[3]">
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="font-semibold text-typography-700">Sub-yield Unit</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="md" className="mt-1">
                                <InputField
                                    type="text"
                                    placeholder="e.g. cookies"
                                    value={subYieldUnit}
                                    onChangeText={setSubYieldUnit}
                                />
                            </Input>
                        </FormControl>
                    </Box>
                </Box>

                <Divider className="my-2" />

                {/* Recipe Ingredients / Materials */}
                <Box className="flex-row justify-between items-center">
                    <Heading size="sm" className="text-typography-900 font-bold">Recipe Ingredients</Heading>
                    <Button size="xs" variant="outline" action="primary" onPress={handleAddIngredient} className="border-red-500">
                        <ButtonText className="text-red-600 dark:text-red-400 font-semibold">+ Add</ButtonText>
                    </Button>
                </Box>

                {ingredients.length === 0 ? (
                    <Box className="py-4 bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg items-center justify-center">
                        <Text size="sm" className="text-typography-400">No ingredients added yet</Text>
                    </Box>
                ) : (
                    <Box className="gap-2">
                        {ingredients.map((ing, idx) => (
                            <IngredientFormCard
                                key={idx}
                                index={idx}
                                ingredient={ing}
                                onChange={handleIngredientChange}
                                onRemove={handleRemoveIngredient}
                                onOpenUnitPicker={(index) => {
                                    setActiveIngredientIdx(index);
                                    setUnitPickerOpen(true);
                                }}
                                onOpenMaterialPicker={(index) => {
                                    setActiveMaterialIngredientIdx(index);
                                    setMaterialPickerOpen(true);
                                }}
                            />
                        ))}
                    </Box>
                )}

                <Button
                    onPress={handleSave}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 mt-4 border-none"
                >
                    <ButtonText className="text-white font-bold">Save Product</ButtonText>
                </Button>
            </Box>

            <UnitPickerModal
                visible={unitPickerOpen}
                options={UNIT_OPTIONS}
                selectedUnit={activeIngredientIdx !== null ? ingredients[activeIngredientIdx]?.unit : ''}
                onSelect={(unit) => {
                    if (activeIngredientIdx !== null) {
                        handleIngredientChange(activeIngredientIdx, 'unit', unit);
                    }
                }}
                onClose={() => {
                    setUnitPickerOpen(false);
                    setActiveIngredientIdx(null);
                }}
            />

            <MaterialPickerModal
                visible={materialPickerOpen}
                materials={materials}
                selectedMaterialName={activeMaterialIngredientIdx !== null ? ingredients[activeMaterialIngredientIdx]?.name : ''}
                isOtherSelected={activeMaterialIngredientIdx !== null ? !!ingredients[activeMaterialIngredientIdx]?.isOther : false}
                onSelect={handleMaterialSelect}
                onClose={() => {
                    setMaterialPickerOpen(false);
                    setActiveMaterialIngredientIdx(null);
                }}
            />
        </ScrollView>
    );
};
