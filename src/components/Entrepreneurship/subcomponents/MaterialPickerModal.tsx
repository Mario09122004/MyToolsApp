import React, { useState, useMemo } from 'react';
import { Modal, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Material } from '@/db/schema';

interface MaterialPickerModalProps {
    visible: boolean;
    materials: Material[];
    selectedMaterialName: string;
    isOtherSelected: boolean;
    onSelect: (materialName: string, unit: string, isOther: boolean) => void;
    onClose: () => void;
}

export const MaterialPickerModal = ({
    visible,
    materials,
    selectedMaterialName,
    isOtherSelected,
    onSelect,
    onClose
}: MaterialPickerModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMaterials = useMemo(() => {
        if (!searchQuery.trim()) return materials;
        return materials.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [materials, searchQuery]);

    const handleClose = () => {
        setSearchQuery('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <Pressable
                className="flex-1 bg-black/50 justify-center items-center p-4"
                onPress={handleClose}
            >
                <Box className="w-full max-w-[320px] max-h-[450px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 gap-3">
                    <Heading size="sm" className="text-typography-900 font-bold mb-1">
                        Select Ingredient
                    </Heading>
                    
                    {/* Search Input */}
                    <Input size="sm">
                        <InputField
                            placeholder="Search ingredients..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </Input>

                    <Divider />
                    
                    <ScrollView showsVerticalScrollIndicator={true} className="max-h-[250px]">
                        {/* "Other" Option */}
                        <TouchableOpacity
                            onPress={() => {
                                onSelect('', 'unit', true);
                                handleClose();
                            }}
                            className="py-2.5 px-1 rounded active:bg-neutral-100 dark:active:bg-neutral-800 flex-row justify-between items-center"
                        >
                            <Text className="text-sm font-bold text-red-650 dark:text-red-400">
                                + Other / New Ingredient
                            </Text>
                            {isOtherSelected && (
                                <Text className="text-xs text-red-600 font-bold">✓</Text>
                            )}
                        </TouchableOpacity>
                        
                        <Divider className="my-1" />

                        {filteredMaterials.length === 0 && searchQuery.trim() !== '' ? (
                            <Box className="py-4 items-center justify-center">
                                <Text size="xs" className="text-neutral-400">No matching ingredients found</Text>
                            </Box>
                        ) : (
                            filteredMaterials.map((mat) => {
                                const isSelected = !isOtherSelected && selectedMaterialName.toLowerCase() === mat.name.toLowerCase();
                                return (
                                    <TouchableOpacity
                                        key={mat.id}
                                        onPress={() => {
                                            onSelect(mat.name, mat.unit || 'unit', false);
                                            handleClose();
                                        }}
                                        className="py-2.5 px-1 rounded active:bg-neutral-100 dark:active:bg-neutral-800 flex-row justify-between items-center"
                                    >
                                        <Text className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                            {mat.name}
                                        </Text>
                                        {isSelected && (
                                            <Text className="text-xs text-red-600 font-bold">✓</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </ScrollView>
                </Box>
            </Pressable>
        </Modal>
    );
};
