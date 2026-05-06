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
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Divider } from '@/components/ui/divider';
import {
    FormControl,
    FormControlLabel,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
    FormControlLabelText,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
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
    const { queryNotes, insertNote, deleteNote, updateNote, queryNotesById } = useCRUDNotes();

    //Edit mode
    const [editMode, sutEditMode] = useState(false);
    const [idNoteToedit, setIdNoteToedit] = useState(0)

    //Notes
    const [dataNotes, setDataNotes] = useState<Task[]>();

    useEffect(() => {
        const queryDataNotes = async () => {
            const notes = await queryNotes();
            setDataNotes(notes);
        }
        queryDataNotes();
    }, [])

    const handleSaveNote = async () => {
        try {
            await insertNote(noteForm.tittle, noteForm.content as string);
            const notes = await queryNotes();
            setDataNotes(notes);
            closeAddModal();
        } catch (error) {
            console.log(error);
        }
    };

    const [noteForm, setNoteForm] = useState<NoteForm>({
        tittle: '',
        content: '',
    });

    const handleDeleteNote = async () => {
        await deleteNote(idNote);
        const notes = await queryNotes();
        setDataNotes(notes);
        closeDeleteModal();
    }

    const handleShowNote = async (noteId: number) => {
        await sutEditMode(true);

        const noteToEdit = await queryNotesById(noteId);
        setNoteForm({ tittle: noteToEdit[0].title, content: noteToEdit[0].content });
        setIdNoteToedit(noteId);

        openAddModal();
    }

    const handleSaveEdit = async () => {
        await updateNote(noteForm.tittle, noteForm.content as string, idNoteToedit);
        const notes = await queryNotes();
        setDataNotes(notes);

        closeAddModal();
    }

    const handleNewNotes = async () => {
        await sutEditMode(false);

        setNoteForm({ tittle: "", content: "" });

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

                            <FormNote note={noteForm} setNoteForm={setNoteForm} />

                        </ModalBody>
                        <ModalFooter>
                            <Button
                                onPress={() => {
                                    if (editMode) {
                                        handleSaveEdit();
                                    } else {
                                        handleSaveNote();
                                    }
                                }}
                                className="bg-green-500"
                            >
                                <ButtonText className='text-black dark:text-white'>Save</ButtonText>
                            </Button>
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
