import {
    SafeAreaView,
    SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { Text } from '@/components/ui/text';
//db
import { Suspense, useEffect } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import * as Notifications from 'expo-notifications';

//
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const DATABASE_NAME = 'tasks.db';
const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);

export const ScreenLayout = ({ children }: { children: React.ReactNode }) => {
    const { success, error } = useMigrations(db, migrations);

    useEffect(() => {
        // Chack and ask permition for notifications
        async function setupNotifications() {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            
            if (finalStatus !== 'granted') {
                console.log('¡Permiso de notificación denegado!');
                return;
            }

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        }

        setupNotifications();
    }, [])

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

    //Add the syc with the birthday notifications

    return (
        <Suspense fallback={<ActivityIndicator size="large" />}>
            <SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }}
                useSuspense>
                <SafeAreaProvider>
                    <GluestackUIProvider>
                        <GestureHandlerRootView>
                            <SafeAreaView style={{ flex: 1 }}>
                                {children}
                            </SafeAreaView>
                        </GestureHandlerRootView>
                    </GluestackUIProvider>
                </SafeAreaProvider >
            </SQLiteProvider>
        </Suspense>
    );
};