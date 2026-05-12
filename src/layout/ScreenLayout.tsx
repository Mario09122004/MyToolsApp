import {
    SafeAreaView,
    SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { Text } from '@/components/ui/text';
//db
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';

export const DATABASE_NAME = 'tasks.db';
const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);

export const ScreenLayout = ({ children }: { children: React.ReactNode }) => {
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
                            {children}
                        </SafeAreaView>
                    </GluestackUIProvider>
                </SafeAreaProvider >
            </SQLiteProvider>
        </Suspense>
    );
};