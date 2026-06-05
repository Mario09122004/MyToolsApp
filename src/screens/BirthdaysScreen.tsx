import { ScrollView, Text } from "react-native";
import { name_Screen } from "../helpers/name_screen";
import { useEffect, useState } from "react";
import ShowBirthdays from "@/src/components/Birthday/show_birthdays";
import { ButtonAddBirthday } from "@/src/components/Birthday/ButtonaddBirthday";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
import { Icon, CloseIcon, TrashIcon } from '@/components/ui/icon';
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
import * as Notifications from 'expo-notifications';

// Hooks
import { useModalBirthdays } from "@/src/hooks/birthdays/modalAdd";
import { useBirthdayDeleteModal } from "@/src/hooks/birthdays/birthdayDeleteModal";
import { useCRUDBirthdays } from "@/src/hooks/birthdays/birthdayAdd";

// Components & Helpers
import { FormBirthday } from "@/src/components/Birthday/formBirthday";
import { Birthday } from "@/db/schema";
import { calculateRemainingDays } from "@/src/utils/birthdayHelpers";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Today " + new Date().toLocaleDateString() + ", it is birthday of someone ",
      body: 'Remember to congratulate them! ',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

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

    const handleNotificationTest = () => {
        schedulePushNotification();
        console.log("Notification test");
    };

    return (
        <>
            <ScrollView className="bg-background-neutral flex-1">
                <Box className="p-4 gap-4">
                    <Button 
                        onPress={handleNotificationTest} 
                        variant="outline" 
                        action="primary" 
                        className="w-full justify-center items-center my-2 border-primary-500"
                    >
                        <ButtonText className="text-primary-500 font-semibold">Text notifications</ButtonText>
                    </Button>

                    <Box className="flex flex-col gap-2">
                        {dataBirthdays && dataBirthdays.length > 0 ? (
                            dataBirthdays.map((birthday) => (
                                <ShowBirthdays 
                                    key={birthday.id} 
                                    birthday={birthday}
                                    handleShowBirthday={handleShowBirthday}
                                    handleDeleteBirthday={openDeleteModal}
                                />
                            ))
                        ) : (
                            <Box className="py-10 items-center justify-center">
                                <Text className="text-typography-400 font-medium text-center">
                                    No hay cumpleaños registrados.
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            </ScrollView>

            <ButtonAddBirthday handleNewBirthdays={handleNewBirthdays} />

            {/* Add/Edit Modal */}
            <Modal
                isOpen={addBirthdayModalVisible}
                onClose={closeAddModal}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent >
                    <ModalHeader className="border-b pb-3">
                        <Heading size="lg" className="text-typography-900 font-bold">
                            {editMode ? "Edit Birthday" : "Register Birthday"}
                        </Heading>
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
                <AlertDialogContent className="max-w-[415px] gap-4 items-center bg-background-neutral">
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
                            action="negative"
                            onPress={handleDeleteBirthday}
                            className="px-[30px]"
                        >
                            <ButtonText className="font-bold">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={closeDeleteModal}
                            size="sm"
                            className="px-[30px]"
                        >
                            <ButtonText className="font-bold text-typography-700">Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}