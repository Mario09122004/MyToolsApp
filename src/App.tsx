import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import "./../global.css";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

import { Box } from '@/components/ui/box';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';
import {
  SafeAreaView,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="dark">
        <SafeAreaView style={{ flex: 1 }}>
          <Box className="h-full w-full bg-background-50 rounded-md">

            <Text className="text-xl font-bold text-blue-500">
              Welcome to Nativewind!
            </Text>

            <Fab
              size="lg"
              placement="bottom right"
              isHovered={false}
              isDisabled={false}
              isPressed={false}
            >
              <FabIcon as={AddIcon} />
              <FabLabel>Create</FabLabel>
            </Fab>
          </Box>
        </SafeAreaView>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
