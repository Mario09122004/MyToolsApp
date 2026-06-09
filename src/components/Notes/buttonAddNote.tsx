import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';

export const ButtonAddNote = ({ handleNewNotes }: { handleNewNotes: () => void }) => {
    return (
        <Fab
            size="lg"
            placement="bottom right"
            isHovered={false}
            isDisabled={false}
            isPressed={true}
            onPress={() => {
                handleNewNotes();
            }}
            className='absolute bottom-16 right-4 bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-500'
        >
            <FabIcon as={AddIcon} />
            <FabLabel>Create</FabLabel>
        </Fab>
    )
}