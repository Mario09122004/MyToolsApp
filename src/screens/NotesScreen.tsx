import { ScrollView, Text } from 'react-native';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';

import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon, CloseIcon, TrashIcon, InfoIcon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';
import { Pressable } from '@/components/ui/pressable';
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
} from '@/components/ui/alert-dialog';

import { useEffect, useState } from 'react';

//Hooks
import { useModalNotes } from '@/src/hooks/notes/modalAdd';
import { useCRUDNotes } from '@/src/hooks/notes/noteAdd';

//Types
import { useNoteModalDelete } from '@/src/hooks/notes/noteDeleteModal';
import { Task } from '@/db/schema';
import { NoteItem } from '../components/Notes/noteItem';
import { ButtonAddNote } from '../components/Notes/buttonAddNote';
import { FormNote } from '../components/Notes/formNote';
import { name_Screen } from '../helpers/name_screen';

export default function NotesScreen() {
    //Name screen
    const { changeNameScreen } = name_Screen();

    useEffect(() => {
        changeNameScreen("Notes")
    }, [])

    //init Hooks
    const { addNoteModalVisible, openAddModal, closeAddModal } = useModalNotes();
    const { deleteConfirmModalVisible, openDeleteModal, closeDeleteModal, idNote } = useNoteModalDelete();
    const { queryNotes, deleteNote } = useCRUDNotes();

    //States
    const [idNOte, setIdNote] = useState(idNote);
    const [editMode, sutEditMode] = useState(false);
    const [dataNotes, setDataNotes] = useState<Task[]>();

    useEffect(() => {
        const queryDataNotes = async () => {
            const notes = await queryNotes();
            setDataNotes(notes);
        }
        queryDataNotes();
    }, [])


    const handleDeleteNote = async () => {
        await deleteNote(idNote);
        const notes = await queryNotes();
        setDataNotes(notes);
        closeDeleteModal();
    }

    const handleShowNote = async (noteId: number) => {
        await sutEditMode(true);
        await setIdNote(noteId);
        openAddModal();
    }

    const handleNewNotes = async () => {
        await sutEditMode(false);
        openAddModal();
    }

    return (
        <>
            {dataNotes && dataNotes.length > 0 ? (
                <ScrollView className="bg-background-neutral flex-1 px-4 py-2">
                    <Box className="gap-3 pb-24">
                        {dataNotes.map((note) => (
                            <Pressable
                                onPress={() => handleShowNote(note.id)}
                                onLongPress={() => openDeleteModal(note.id)}
                                key={note.id}
                            >
                                <NoteItem title={note.title as string} content={note.content as string} date={note.date} />
                            </Pressable>
                        ))}
                    </Box>
                </ScrollView>
            ) : (
                <Box className="flex-1 bg-background-neutral px-4 items-center justify-center">
                    <Box className="w-full py-20 items-center justify-center bg-background-neutral border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-6 mb-24">
                        <Box className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center mb-3">
                            <Icon as={InfoIcon} size="xl" className="text-typography-400" />
                        </Box>
                        <Text className="text-typography-500 font-semibold text-center text-base">
                            No hay notas creadas
                        </Text>
                        <Text className="text-typography-400 text-center mt-1">
                            Presiona el botón "Create" para agregar una nueva nota.
                        </Text>
                    </Box>
                </Box>
            )}

            <Modal
                isOpen={addNoteModalVisible}
                onClose={() => {
                    closeAddModal();
                }}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">{editMode ? "Edit" : "Add"} note</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <Divider className="my-3" />
                    <ModalBody>
                        <FormNote editMode={editMode} idNote={idNOte} onSave={async () => {
                            const notes = await queryNotes();
                            setDataNotes(notes);
                        }} />
                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>

            <ButtonAddNote handleNewNotes={handleNewNotes} />

            <AlertDialog isOpen={deleteConfirmModalVisible} onClose={() => { closeDeleteModal() }}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md">Delete note?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center">
                            The note will be deleted permanently. This cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5">
                        <Button
                            size="sm"
                            action="negative"
                            onPress={() => handleDeleteNote()}
                            className="px-[30px]"
                        >
                            <ButtonText>Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={() => closeDeleteModal()}
                            size="sm"
                            className="px-[30px]"
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
