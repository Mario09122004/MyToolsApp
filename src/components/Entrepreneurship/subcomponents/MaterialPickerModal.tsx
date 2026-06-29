import React, { useState, useMemo } from 'react';
import { Modal, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Icon, TrashIcon, EditIcon, CloseIcon } from '@/components/ui/icon';
import { Material } from '@/db/schema';
import { Button, ButtonText } from '@/components/ui/button';

interface MaterialPickerModalProps {
    visible: boolean;
    materials: Material[];
    selectedMaterialName: string;
    isOtherSelected: boolean;
    onSelect: (materialName: string, unit: string, isOther: boolean) => void;
    onClose: () => void;
    onUpdateMaterial?: (id: number, name: string, unit: string) => Promise<void>;
    onDeleteMaterial?: (id: number) => Promise<void>;
}

export const MaterialPickerModal = ({
    visible,
    materials,
    selectedMaterialName,
    isOtherSelected,
    onSelect,
    onClose,
    onUpdateMaterial,
    onDeleteMaterial
}: MaterialPickerModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Edit Mode State
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [editName, setEditName] = useState('');
    const [editUnit, setEditUnit] = useState('');

    const UNIT_OPTIONS = ['unit', 'gr', 'Kg', 'ml', 'L', 'cup', 'spoonful'];

    const filteredMaterials = useMemo(() => {
        if (!searchQuery.trim()) return materials;
        return materials.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [materials, searchQuery]);

    const handleClose = () => {
        setSearchQuery('');
        setEditingMaterial(null);
        onClose();
    };

    const handleStartEdit = (mat: Material) => {
        setEditingMaterial(mat);
        setEditName(mat.name);
        setEditUnit(mat.unit);
    };

    const handleSaveEdit = async () => {
        if (editingMaterial && editName.trim()) {
            if (onUpdateMaterial) {
                await onUpdateMaterial(editingMaterial.id, editName.trim(), editUnit);
            }
            setEditingMaterial(null);
        }
    };

    const handleDelete = async () => {
        if (editingMaterial) {
            if (onDeleteMaterial) {
                await onDeleteMaterial(editingMaterial.id);
            }
            setEditingMaterial(null);
        }
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
                {/* Prevent click propagation outside */}
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <Box className="w-[320px] max-h-[460px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 gap-3">
                        {editingMaterial ? (
                            // Edit Form View
                            <Box className="gap-3">
                                <Box className="flex-row justify-between items-center">
                                    <Heading size="xs" className="text-typography-900 font-bold">
                                        Edit Material
                                    </Heading>
                                    <TouchableOpacity onPress={() => setEditingMaterial(null)} className="p-1">
                                        <Icon as={CloseIcon} size="sm" />
                                    </TouchableOpacity>
                                </Box>

                                <Divider />

                                <Box className="gap-1">
                                    <Text size="xs" className="font-semibold text-neutral-500">Material Name</Text>
                                    <Input size="sm">
                                        <InputField
                                            value={editName}
                                            onChangeText={setEditName}
                                            placeholder="e.g. Whole Milk"
                                        />
                                    </Input>
                                </Box>

                                <Box className="gap-1">
                                    <Text size="xs" className="font-semibold text-neutral-500 mb-1">Default Unit</Text>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="flex-row gap-1.5 py-1">
                                        {UNIT_OPTIONS.map((u) => (
                                            <TouchableOpacity
                                                key={u}
                                                onPress={() => setEditUnit(u)}
                                                className={`px-3 py-1.5 rounded-full border ${editUnit === u ? 'bg-red-600 border-red-600' : 'bg-transparent border-neutral-300 dark:border-neutral-700'}`}
                                            >
                                                <Text size="xs" className={editUnit === u ? 'text-white font-bold' : 'text-neutral-700 dark:text-neutral-300'}>
                                                    {u}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </Box>

                                <Divider className="my-1" />

                                <Box className="flex-row gap-2 mt-1">
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-red-600 hover:bg-red-700 border-none"
                                        onPress={handleSaveEdit}
                                    >
                                        <ButtonText className="text-white font-bold">Save</ButtonText>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 border-neutral-300 dark:border-neutral-700"
                                        onPress={() => setEditingMaterial(null)}
                                    >
                                        <ButtonText className="text-neutral-700 dark:text-neutral-350 font-bold">Cancel</ButtonText>
                                    </Button>
                                </Box>

                                <TouchableOpacity
                                    onPress={handleDelete}
                                    className="flex-row items-center justify-center gap-1 mt-1 p-2 bg-red-50 dark:bg-red-950/20 rounded"
                                >
                                    <Icon as={TrashIcon} size="xs" className="text-red-600 dark:text-red-400" />
                                    <Text size="xs" className="text-red-600 dark:text-red-400 font-bold">
                                        Delete Material
                                    </Text>
                                </TouchableOpacity>
                            </Box>
                        ) : (
                            // List View
                            <>
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
                                                <Box
                                                    key={mat.id}
                                                    className="flex-row justify-between items-center py-1.5 px-1 rounded hover:bg-neutral-50 dark:hover:bg-neutral-850"
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            onSelect(mat.name, mat.unit || 'unit', false);
                                                            handleClose();
                                                        }}
                                                        className="flex-1 flex-row justify-between items-center pr-3"
                                                    >
                                                        <Text className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                                            {mat.name} <Text size="2xs" className="text-neutral-450 dark:text-neutral-500 font-normal">({mat.unit})</Text>
                                                        </Text>
                                                        {isSelected && (
                                                            <Text className="text-xs text-red-600 font-bold">✓</Text>
                                                        )}
                                                    </TouchableOpacity>
                                                    
                                                    {/* Edit Button */}
                                                    <TouchableOpacity
                                                        onPress={() => handleStartEdit(mat)}
                                                        className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 active:bg-neutral-200"
                                                    >
                                                        <Icon as={EditIcon} size="xs" className="text-neutral-600 dark:text-neutral-400" />
                                                    </TouchableOpacity>
                                                </Box>
                                            );
                                        })
                                    )}
                                </ScrollView>
                            </>
                        )}
                    </Box>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
