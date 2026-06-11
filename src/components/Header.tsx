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
import { Icon, CloseIcon, MenuIcon, SunIcon, MoonIcon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuOptions } from "./menu";

import { name_Screen } from "../helpers/name_screen";

export const Header = ({ navigation }: { navigation: any }) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const insets = useSafeAreaInsets();
    const { nameScreen } = name_Screen();
    const { colorScheme, setColorScheme } = useColorScheme();

    const toggleTheme = () => {
        setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Box className='p-4 flex-row items-center bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900'>
            <Button
                onPress={() => {
                    setShowDrawer(true);
                }}
                className="bg-transparent p-0 w-10 h-10 items-center justify-center rounded-full hover:bg-neutral-100 active:bg-neutral-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
            >
                <Icon as={MenuIcon} size="xl" className="text-red-600 dark:text-red-500" />
            </Button>
            <Heading className="ml-3 flex-1 text-typography-900 font-extrabold tracking-tight" size="xl">
                {nameScreen}
            </Heading>
            <Button
                onPress={toggleTheme}
                className="bg-transparent p-0 w-10 h-10 items-center justify-center rounded-full hover:bg-neutral-100 active:bg-neutral-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
            >
                <Icon as={colorScheme === 'dark' ? SunIcon : MoonIcon} size="xl" className="text-red-600 dark:text-red-500" />
            </Button>
            <Drawer
                isOpen={showDrawer}
                size="full"
                anchor="top"
                onClose={() => {
                    setShowDrawer(false);
                }}
            >
                <DrawerBackdrop />
                <DrawerContent style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="bg-white/75 dark:bg-black/75 backdrop-blur-3xl">
                    <DrawerHeader className="border-b border-neutral-100 dark:border-neutral-900 py-3 relative">
                        <Heading size="xl" className="w-full text-center text-typography-950 font-extrabold tracking-tight" >Menu</Heading>
                        <DrawerCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon as={CloseIcon} size="xl" className="text-red-600 dark:text-red-500" />
                        </DrawerCloseButton>
                    </DrawerHeader>

                    <DrawerBody className="mt-2 px-4" >
                        <MenuOptions navigation={navigation} handleClose={() => setShowDrawer(false)} />
                    </DrawerBody>

                    <DrawerFooter className="py-4 px-4 border-t border-neutral-100 dark:border-neutral-900">
                        <Button
                            variant="outline"
                            onPress={() => {
                                setShowDrawer(false);
                            }}
                            className="w-full border-red-600 active:bg-red-50 dark:border-red-500 dark:active:bg-red-950/20"
                        >
                            <ButtonText className="text-red-600 dark:text-red-400 font-bold">Close Menu</ButtonText>
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}