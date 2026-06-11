import { ScrollView, Text } from "react-native";
import { name_Screen } from "../helpers/name_screen";
import { useEffect, useState } from "react";
import ShowBirthdays from "@/src/components/Birthday/show_birthdays";
import { ButtonAddBirthday } from "@/src/components/Birthday/ButtonaddBirthday";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
import { Icon, CloseIcon, TrashIcon, InfoIcon } from '@/components/ui/icon';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from '@/components/ui/modal';
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
} from '@/components/ui/alert-dialog';

// Hooks
import { useModalBirthdays } from "@/src/hooks/birthdays/modalAdd";
import { useBirthdayDeleteModal } from "@/src/hooks/birthdays/birthdayDeleteModal";
import { useCRUDBirthdays } from "@/src/hooks/birthdays/birthdayAdd";

// Components & Helpers
import { FormBirthday } from "@/src/components/Birthday/formBirthday";
import { Birthday } from "@/db/schema";
import { calculateRemainingDays } from "@/src/utils/birthdayHelpers";
import * as Notifications from 'expo-notifications';

export default function BirthdaysScreen() {
    const { changeNameScreen } = name_Screen();

    useEffect(() => {
        changeNameScreen("Birthdays");
    }, []);

    // Hooks
    const { addBirthdayModalVisible, openAddModal, closeAddModal } = useModalBirthdays();
    const { deleteConfirmModalVisible, openDeleteModal, closeDeleteModal, idBirthday } = useBirthdayDeleteModal();
    const { queryBirthdays, deleteBirthday } = useCRUDBirthdays();

    // States
    const [editMode, setEditMode] = useState(false);
    const [selectedBirthdayId, setSelectedBirthdayId] = useState(idBirthday);
    const [dataBirthdays, setDataBirthdays] = useState<Birthday[]>([]);

    const fetchBirthdays = async () => {
        const birthdaysList = await queryBirthdays();
        // Sort by nearest upcoming birthday
        const sortedBirthdays = [...birthdaysList].sort((a, b) => {
            return calculateRemainingDays(a.date) - calculateRemainingDays(b.date);
        });
        setDataBirthdays(sortedBirthdays);
    };

    useEffect(() => {
        fetchBirthdays();
    }, []);

    const handleDeleteBirthday = async () => {
        try {
            await Notifications.cancelScheduledNotificationAsync(`cumple-${idBirthday.toString()}`);
            // console.log(`Notification cancelled for birthday ID: ${idBirthday}`);
        } catch (error) {
            console.error("Error cancelling notification:", error);
        }
        await deleteBirthday(idBirthday);
        await fetchBirthdays();

        closeDeleteModal();
    };

    const handleShowBirthday = async (id: number) => {
        setEditMode(true);
        setSelectedBirthdayId(id);
        openAddModal();
    };

    const handleNewBirthdays = async () => {
        setEditMode(false);
        setSelectedBirthdayId(0);
        openAddModal();
    };

    return (
        <>
            {dataBirthdays && dataBirthdays.length > 0 ? (
                <ScrollView className="bg-neutral-50 dark:bg-neutral-950 flex-1">
                    <Box className="p-4 gap-4">
                        <Box className="flex flex-col gap-2">
                            {dataBirthdays.map((birthday) => (
                                <ShowBirthdays 
                                    key={birthday.id} 
                                    birthday={birthday}
                                    handleShowBirthday={handleShowBirthday}
                                    handleDeleteBirthday={openDeleteModal}
                                />
                            ))}
                        </Box>
                    </Box>
                </ScrollView>
            ) : (
                <Box className="flex-1 bg-neutral-50 dark:bg-neutral-950 px-4 items-center justify-center">
                    <Box className="w-full py-20 items-center justify-center bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-6 mb-24">
                        <Box className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center mb-3">
                            <Icon as={InfoIcon} size="xl" className="text-red-600 dark:text-red-500" />
                        </Box>
                        <Text className="text-typography-500 font-semibold text-center text-base">
                            No birthdays registered
                        </Text>
                        <Text className="text-typography-400 text-center mt-1 text-sm">
                            Press the "Register" button below to add a birthday.
                        </Text>
                    </Box>
                </Box>
            )}

            <ButtonAddBirthday handleNewBirthdays={handleNewBirthdays} />

            {/* Add/Edit Modal */}
            <Modal
                isOpen={addBirthdayModalVisible}
                onClose={closeAddModal}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent >
                    <ModalHeader className="border-b pb-3 relative">
                        <Heading size="lg" className="text-typography-900 font-bold">
                            {editMode ? "Edit Birthday" : "Register Birthday"}
                        </Heading>
                        <ModalCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="py-4">
                        <FormBirthday 
                            editMode={editMode} 
                            idBirthday={selectedBirthdayId} 
                            onSave={fetchBirthdays} 
                            onClose={closeAddModal} 
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog isOpen={deleteConfirmModalVisible} onClose={closeDeleteModal}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md" className="text-typography-900 font-bold">Delete Birthday?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center text-typography-600">
                            This birthday entry will be deleted permanently. This cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5 gap-3 w-full flex-row justify-center">
                        <Button
                            size="sm"
                            onPress={handleDeleteBirthday}
                            className="px-[30px] bg-red-600 active:bg-red-700 hover:bg-red-700 border-none"
                        >
                            <ButtonText className="font-bold text-white">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={closeDeleteModal}
                            size="sm"
                            className="px-[30px] border-neutral-300 dark:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900"
                        >
                            <ButtonText className="font-bold text-typography-700">Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}