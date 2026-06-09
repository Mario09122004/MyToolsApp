import {
    FormControl,
    FormControlLabel,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
    FormControlLabelText,
} from '@/components/ui/form-control';

import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { AlertCircleIcon } from '@/components/ui/icon';
import React, { useEffect, useState } from 'react';
import { useNoteForm } from '@/src/hooks/notes/noteForm';
import { useCRUDNotes } from '@/src/hooks/notes/noteAdd';
import { Button, ButtonText } from '@/components/ui/button';

export const FormNote = ({ editMode, idNote = 0, onSave }: { editMode: boolean, idNote?: number, onSave?: () => void }) => {
    const { noteForm, handleSetContent, handleSetTittle, handleSetNewForm } = useNoteForm();
    const { insertNote, queryNotesById, updateNote } = useCRUDNotes();
    const [NoteIdEdit, setNoteIdEdit] = useState(idNote);
    const [editModeNote, setEditModeNote] = useState(editMode);

    useEffect(() => {
        if (!editModeNote) {
            handleSetNewForm();
        } else {
            const NoteData = async () => {
                const note = await queryNotesById(NoteIdEdit);
                await handleSetTittle(note[0].title);
                await handleSetContent(note[0].content);
            }
            NoteData();
        }
    }, [editModeNote, NoteIdEdit]);

    const handleSaveNote = async () => {
        try {
            const noteCreated = await insertNote(noteForm.tittle, noteForm.content as string);
            setNoteIdEdit(noteCreated.lastInsertRowId);
            setEditModeNote(true);
            if (onSave) onSave();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSaveEdit = async () => {
        try {
            await updateNote(noteForm.tittle, noteForm.content as string, NoteIdEdit);
            if (onSave) onSave();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <FormControl
            size="md"
        >
            <FormControlLabel>
                <FormControlLabelText>Tittle</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    placeholder="Tittle"
                    value={noteForm.tittle}
                    onChangeText={(text) => {
                        handleSetTittle(text);
                    }}
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
                <TextareaInput placeholder="Note content..." onChangeText={(text) => handleSetContent(text)} value={noteForm.content as string} />
            </Textarea>
            <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                <FormControlErrorText className="text-red-500">
                    Please, complete all the fields.
                </FormControlErrorText>
            </FormControlError>

            <Button
                onPress={() => {
                    if (editModeNote) {
                        handleSaveEdit();
                    } else {
                        handleSaveNote();
                    }
                }}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-500 mt-5"
            >
                <ButtonText className='text-white font-bold'>Save</ButtonText>
            </Button>

        </FormControl>
    )
}
