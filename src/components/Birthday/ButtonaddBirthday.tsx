import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';

export const ButtonAddBirthday = () => {
    return (
        <Fab
            size="lg"
            placement="bottom right"
            isHovered={false}
            isDisabled={false}
            isPressed={true}
            onPress={() => {
                console.log("Add birthday");
                //handleNewBirthdays();
            }}
            className='absolute bottom-8 right-4 bg-white/20'
        >
            <FabIcon as={AddIcon} />
            <FabLabel>Register</FabLabel>
        </Fab>
    )
}