import { Fab, FabIcon } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';

export default function AddHabit({ onPress }: { onPress: () => void }) {
    return (
        <Fab
            size="lg"
            placement="top right"
            isHovered={false}
            isDisabled={false}
            isPressed={true}
            onPress={onPress}
            className='bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-500 mt-20'
        >
            <FabIcon as={AddIcon} />
        </Fab>
    )
}