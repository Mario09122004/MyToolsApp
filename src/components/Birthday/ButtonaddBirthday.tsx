import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';

export const ButtonAddBirthday = ({ handleNewBirthdays }: { handleNewBirthdays: () => void }) => {
    return (
        <Fab
            size="lg"
            placement="bottom right"
            isHovered={false}
            isDisabled={false}
            isPressed={true}
            onPress={() => {
                handleNewBirthdays();
            }}
            className="absolute bottom-16 right-4"
        >
            <FabIcon as={AddIcon} />
            <FabLabel>Register</FabLabel>
        </Fab>
    );
};