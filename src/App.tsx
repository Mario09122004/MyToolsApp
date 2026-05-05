import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import "./../global.css";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

import { Box } from '@/components/ui/box';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
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
  FormControlHelper,
  FormControlHelperText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from '@/components/ui/alert-dialog';

import {
  SafeAreaView,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useState } from 'react';

//Hooks
import { useModalNotes } from './hooks/notes/modalAdd';

//Types
import { Note } from './types/Notes/Note';
import { NoteForm } from './types/Notes/NoteForm';

//Layout
import { ScreenLayout } from './layout/ScreenLayout';



const notesExamples: Array<Note> = [
  {
    tittle: 'Note 1',
    content: 'Content 1',
    date: new Date(Date.now())
  }
]

export default function App() {
  //init Hooks
  const { addNoteModalVisible, openAddModal, closeAddModal } = useModalNotes();

  const [noteForm, setNoteForm] = useState<NoteForm>({
    tittle: '',
    content: ''
  });
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false);

  const [allNotesView, setAllNotesView] = useState<Note[]>(notesExamples);

  const handleSaveNote = () => {
    const noteToSave: Note = {
      tittle: noteForm.tittle,
      content: noteForm.content,
      date: new Date(Date.now())
    }

    setAllNotesView([...allNotesView, noteToSave])

    setNoteForm({
      tittle: '',
      content: ''
    })

    closeAddModal();
  };

  const handleDeleteNote = (index: number) => {
    console.log(index);
    //setAllNotesView(allNotesView.filter((_, i) => i !== index))
    setDeleteConfirmModalVisible(false)
  }

  const handleShowNote = (noteId: number) => {
    //Note to show exactly data of the note
    const note: Note = allNotesView[noteId]
    console.log("Tittle: ", note.tittle)
    console.log("Content: ", note.content)

  }

  return (
    <ScreenLayout>
      <ScrollView>
        <Box className="h-full w-full rounded-xs">

          {allNotesView.map((note, index) => (
            <Pressable
              onPress={() => handleShowNote(index)}
              onLongPress={() => console.log("borrando..")}
              key={index}
            >
              <Card size="lg" variant="outline" className="m-2">
                <Box className="flex flex-row justify-between">
                  <Heading size="xl" className="mb-1">
                    {note.tittle}
                  </Heading>
                  <Heading size="xs" className="mb-1 text-gray-500">
                    {note.date.toDateString()}
                  </Heading>
                </Box>
                <Text className='line-clamp-3'>{note.content}</Text>
              </Card>
            </Pressable>
          ))}
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
              <Heading size="lg">Add note</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <Divider className="my-3" />
            <ModalBody>

              <FormControl
                size="md"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
              >
                <FormControlLabel>
                  <FormControlLabelText>Tittle</FormControlLabelText>
                </FormControlLabel>
                <Input className="my-1" size="md">
                  <InputField
                    type="text"
                    placeholder="Tittle"
                    value={noteForm.tittle}
                    onChangeText={(text) => setNoteForm({ ...noteForm, tittle: text })}
                  />
                </Input>
                <FormControlLabel className='mt-2'>
                  <FormControlLabelText>Content</FormControlLabelText>
                </FormControlLabel>
                <Textarea
                  size="md"
                  isReadOnly={false}
                  isInvalid={false}
                  isDisabled={false}
                  className='mt-2'
                >
                  <TextareaInput placeholder="Note content..." onChangeText={(text) => setNoteForm({ ...noteForm, content: text })} value={noteForm.content} />
                </Textarea>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                  <FormControlErrorText className="text-red-500">
                    Please, complete all the fields.
                  </FormControlErrorText>
                </FormControlError>

              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={() => {
                  handleSaveNote();
                }}
                className="bg-green-500"
              >
                <ButtonText className='text-black dark:text-white'>Save</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ScrollView>

      <Fab
        size="lg"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={true}
        onPress={() => {
          openAddModal();
        }}
        className='absolute bottom-16 right-4'
      >
        <FabIcon as={AddIcon} />
        <FabLabel>Create</FabLabel>
      </Fab>

      <AlertDialog isOpen={deleteConfirmModalVisible} onClose={() => { setDeleteConfirmModalVisible(false) }}>
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
              onPress={() => setDeleteConfirmModalVisible(false)}
              className="px-[30px]"
            >
              <ButtonText>Delete</ButtonText>
            </Button>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setDeleteConfirmModalVisible(false)}
              size="sm"
              className="px-[30px]"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </ScreenLayout>
  );
}
