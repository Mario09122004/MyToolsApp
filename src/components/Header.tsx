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
import { Icon, CloseIcon, MenuIcon } from '@/components/ui/icon';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuOptions } from "./menu";
import { Divider } from "@/components/ui/divider";

import { useNavigation } from '@react-navigation/native';

export const Header = () => {
    const [showDrawer, setShowDrawer] = useState(false);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

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
                <DrawerContent style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
                    <DrawerHeader>
                        <Heading size="xl" className="w-full text-center" >Menu</Heading>
                        <DrawerCloseButton className="absolute right-0">
                            <Icon as={CloseIcon} size="xl" />
                        </DrawerCloseButton>
                    </DrawerHeader>

                    <Divider className="my-0.5" />

                    <DrawerBody className="mt-2" >

                        <MenuOptions navigation={navigation} />

                    </DrawerBody>

                    <Divider className="mb-2" />

                    <DrawerFooter className="py-3">
                        <Button
                            variant="outline"
                            onPress={() => {
                                setShowDrawer(false);
                            }}
                            className="w-full"
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}