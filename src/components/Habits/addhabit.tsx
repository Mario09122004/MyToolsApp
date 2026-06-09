import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';

export default function AddHabit() {
    return (
        <Fab
            size="lg"
            placement="top right"
            isHovered={false}
            isDisabled={false}
            isPressed={true}
            onPress={() => {
                console.log("Add Habit");
            }}
            className='bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-500'
        >
            <FabIcon as={AddIcon} />
        </Fab>
    )
}