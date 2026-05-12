import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotesScreen from '@/src/screens/NotesScreen';
import BirthdaysScreen from '@/src/screens/BirthdaysScreen';

import { Header } from '@/src/components/Header';
import { Divider } from '@/components/ui/divider';
import HabitsScreen from '../screens/HabitsScreen';
import TasksScreen from '../screens/TasksScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import LoansScreen from '../screens/LoansScreen';
import ProgramingMessageScreen from '../screens/ProgramingMessageScreen';
import EntrepreneurshipScreen from '../screens/EntrepreneurshipScreen';

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
        HabitsScreen: {
            screen: HabitsScreen,
            options: { title: 'Habits' },
        },
        TasksScreen: {
            screen: TasksScreen,
            options: { title: 'Tasks' },
        },
        ProjectsScreen: {
            screen: ProjectsScreen,
            options: { title: 'Projects' },
        },
        LoansScreen: {
            screen: LoansScreen,
            options: { title: 'Loans' },
        },
        ProgramingMessageScreen: {
            screen: ProgramingMessageScreen,
            options: { title: 'Programing message' },
        },
        EntrepreneurshipScreen: {
            screen: EntrepreneurshipScreen,
            options: { title: 'Entrepreneurship' },
        },
    },
});

const Navigation = createStaticNavigation(RootStack);

export default function NavigationApp() {
    return <Navigation />;
}