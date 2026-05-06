import { Box } from "@/components/ui/box"
import { useState } from "react"
import {
    Drawer,
    DrawerBackdrop,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    DrawerCloseButton,
} from '@/components/ui/drawer';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon, MenuIcon } from '@/components/ui/icon';

export const Header = () => {
    const [showDrawer, setShowDrawer] = useState(false);

    return (
        <Box className='p-4 flex-row items-center'>
            <Button
                onPress={() => {
                    console.log('Menu button pressed');
                    setShowDrawer(true);
                }}
                className=''
            >
                <Icon as={MenuIcon} />
            </Button>
            <Heading className="mx-5 w-4/5">
                Title of the componentes
            </Heading>
            <Drawer
                isOpen={showDrawer}
                size="full"
                anchor="top"
                onClose={() => {
                    setShowDrawer(false);
                }}
            >
                <DrawerBackdrop />
                <DrawerContent>
                    <DrawerHeader>
                        <Heading size="lg">Menu</Heading>
                        <DrawerCloseButton>
                            <Icon as={CloseIcon} />
                        </DrawerCloseButton>
                    </DrawerHeader>
                    <DrawerBody>
                        <Text>This is the basic drawer component.</Text>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button
                            variant="outline"
                            onPress={() => {
                                setShowDrawer(false);
                            }}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}