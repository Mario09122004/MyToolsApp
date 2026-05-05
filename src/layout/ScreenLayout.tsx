import {
    SafeAreaView,
    SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

//db
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';

export const DATABASE_NAME = 'tasks';
const queryClient = new QueryClient();


export const ScreenLayout = ({ children }: { children: React.ReactNode }) => {

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