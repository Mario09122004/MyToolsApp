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

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Header = () => {
    const [showDrawer, setShowDrawer] = useState(false);
    const insets = useSafeAreaInsets();

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
            <Heading className="mx-5 w-4/5" size="xl">
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
                <DrawerContent className="bg-red-600" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
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