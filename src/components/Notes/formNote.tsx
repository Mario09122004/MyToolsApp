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
import { NoteForm } from '@/src/types/Notes/NoteForm';

export const FormNote = ({ note, setNoteForm }: { note: NoteForm, setNoteForm: (note: NoteForm) => void }) => {
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
                    value={note.tittle}
                    onChangeText={(text) => setNoteForm({ ...note, tittle: text })}
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
                <TextareaInput placeholder="Note content..." onChangeText={(text) => setNoteForm({ ...note, content: text })} value={note.content as string} />
            </Textarea>
            <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                <FormControlErrorText className="text-red-500">
                    Please, complete all the fields.
                </FormControlErrorText>
            </FormControlError>

        </FormControl>
    )
}