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

    useEffect(() => {
        changeNameScreen("Birthdays");
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