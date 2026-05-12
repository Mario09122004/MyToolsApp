import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotesScreen from '@/src/screens/NotesScreen';
import BirthdaysScreen from '@/src/screens/BirthdaysScreen';

import { Header } from '@/src/components/Header';
import { Divider } from '@/components/ui/divider';

const RootStack = createNativeStackNavigator({
    screenOptions: {
        header: () => (
            <>
                <Header />
                <Divider className="my-0.5" />
            </>
        ),
    },
    screens: {
        NotesScreen: {
            screen: NotesScreen,
            options: { title: 'Notes' },
        },
        BirthdaysScreen: {
            screen: BirthdaysScreen,
            options: { title: 'Birthdays' },
        },
    },
});

const Navigation = createStaticNavigation(RootStack);

export default function NavigationApp() {
    return <Navigation />;
}