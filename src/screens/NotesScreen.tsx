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
import { Icon, CloseIcon, TrashIcon } from '@/components/ui/icon';
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
import { NoteForm } from '@/src/types/Notes/NoteForm';
import { useNoteModalDelete } from '@/src/hooks/notes/noteDeleteModal';
import { Task } from '@/db/schema';
import { NoteItem } from '../components/Notes/noteItem';
import { ButtonAddNote } from '../components/Notes/buttonAddNote';
import { FormNote } from '../components/Notes/formNote';

export default function NotesScreen() {
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
            <ScrollView>
                <Box className="h-full w-full rounded-xs">

                    {
                        dataNotes ? (
                            dataNotes.map((note) => (
                                <Pressable
                                    onPress={() => handleShowNote(note.id)}
                                    onLongPress={() => openDeleteModal(note.id)}
                                    key={note.id}
                                >
                                    <NoteItem title={note.title as string} content={note.content as string} date={note.date} />
                                </Pressable>
                            ))
                        ) : (
                            <Text>No hay notas</Text>
                        )
                    }
                </Box>

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

                            <FormNote editMode={editMode} idNote={idNOte} />

                        </ModalBody>
                        <ModalFooter>

                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </ScrollView>

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
