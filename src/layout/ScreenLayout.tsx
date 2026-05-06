import {
    SafeAreaView,
    SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { ScrollView, StyleSheet, View } from 'react-native';

//db
import { Suspense, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';

//Menu
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
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';

export const DATABASE_NAME = 'tasks.db';
const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);

export const ScreenLayout = ({ children }: { children: React.ReactNode }) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const { success, error } = useMigrations(db, migrations);

    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Error de automatización: {error.message}</Text>
            </SafeAreaView>
        );
    }

    if (!success) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#FF0055" />
                <Text className="text-white mt-4 font-bold">
                    Actualizando esquemas...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <Suspense fallback={<ActivityIndicator size="large" />}>
            <SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }}
                useSuspense>
                <SafeAreaProvider>
                    <GluestackUIProvider>
                        <SafeAreaView style={{ flex: 1 }}>
                            <Box>
                                <Button
                                    onPress={() => {
                                        setShowDrawer(true);
                                    }}
                                >
                                    <ButtonText>Open Drawer</ButtonText>
                                </Button>
                                <Heading>
                                    Title of the component
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
                            <Divider className="my-0.5" />
                            {children}
                        </SafeAreaView>
                    </GluestackUIProvider>
                </SafeAreaProvider >
            </SQLiteProvider>
        </Suspense>
    );
};