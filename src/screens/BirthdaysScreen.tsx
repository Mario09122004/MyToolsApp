import { Platform, View } from "react-native"
import { name_Screen } from "../helpers/name_screen";
import { useEffect } from "react";
import ShowBirthdays from "@/src/components/Birthday/show_birthdays";
import { ButtonAddBirthday } from "@/src/components/Birthday/ButtonaddBirthday";
import { ScrollView } from 'react-native';
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Today " + new Date().toLocaleDateString() + ", it is birthday of someone ",
      body: 'Remember to congratulate them! ',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

export default function BirthdaysScreen() {
    const { changeNameScreen } = name_Screen();

    //Permission
    useEffect(() => {
        changeNameScreen("Birthdays");

        // 2. Pedir permisos y configurar el Canal de Android al cargar la pantalla
        async function setupNotifications() {
            // Revisar y pedir permiso al usuario
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

            // Crear el canal exclusivo para Android
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

    const handleDeleteBirthday = () => {
        console.log("Delete birthday");
    }

    const handleShowBirthday = () => {
        console.log("Show birthday");
    }

    const handleNotificationTest = () => {
        schedulePushNotification();
        console.log("Notification test");
    }

    return (
        <>
            <ScrollView>
                <View className="h-full w-full bg-red-700">
                    <ScrollView className="bg-green-400">
                        <Button onPress={handleNotificationTest}>
                            <ButtonText>Notificacion test</ButtonText>
                        </Button>
                        <Box className='flex flex-col gap-2'>
                            <ShowBirthdays handleDeleteBirthday={handleDeleteBirthday} handleShowBirthday={handleShowBirthday} />
                            <ShowBirthdays handleDeleteBirthday={handleDeleteBirthday} handleShowBirthday={handleShowBirthday} />
                            <ShowBirthdays handleDeleteBirthday={handleDeleteBirthday} handleShowBirthday={handleShowBirthday} />
                            <ShowBirthdays handleDeleteBirthday={handleDeleteBirthday} handleShowBirthday={handleShowBirthday} />
                            <ShowBirthdays handleDeleteBirthday={handleDeleteBirthday} handleShowBirthday={handleShowBirthday} />
                            <ShowBirthdays handleDeleteBirthday={handleDeleteBirthday} handleShowBirthday={handleShowBirthday} />
                            <ShowBirthdays handleDeleteBirthday={handleDeleteBirthday} handleShowBirthday={handleShowBirthday} />
                            <ShowBirthdays handleDeleteBirthday={handleDeleteBirthday} handleShowBirthday={handleShowBirthday} />
                        </Box>
                    </ScrollView>
                </View>
            </ScrollView>
            <ButtonAddBirthday />
        </>
    )
}