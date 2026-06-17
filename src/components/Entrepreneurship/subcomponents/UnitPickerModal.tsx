import React from 'react';
import { Modal, TouchableOpacity, Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';

interface UnitPickerModalProps {
    visible: boolean;
    options: string[];
    selectedUnit: string;
    onSelect: (unit: string) => void;
    onClose: () => void;
}

export const UnitPickerModal = ({
    visible,
    options,
    selectedUnit,
    onSelect,
    onClose
}: UnitPickerModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/50 justify-center items-center p-4"
                onPress={onClose}
            >
                <Box className="w-full max-w-[280px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 gap-3 shadow-lg">
                    <Heading size="xs" className="text-typography-900 font-bold mb-1">
                        Select Unit
                    </Heading>
                    <Divider />
                    {options.map((opt) => (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => {
                                onSelect(opt);
                                onClose();
                            }}
                            className="py-2.5 px-1 rounded active:bg-neutral-100 dark:active:bg-neutral-800 flex-row justify-between items-center"
                        >
                            <Text className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                {opt}
                            </Text>
                            {selectedUnit === opt && (
                                <Text className="text-xs text-red-600 font-bold">✓</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </Box>
            </Pressable>
        </Modal>
    );
};
