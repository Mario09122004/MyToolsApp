import { View } from "react-native"
import { name_Screen } from "../helpers/name_screen";
import { useEffect } from "react";
import ShowBirthdays from "@/src/components/Birthday/show_birthdays";
import { ButtonAddBirthday } from "@/src/components/Birthday/ButtonaddBirthday";
import { ScrollView } from 'react-native';
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BirthdaysScreen() {
    const { changeNameScreen } = name_Screen();

    useEffect(() => {
        changeNameScreen("Birthdays")
    }, [])

    const handleDeleteBirthday = () => {
        console.log("Delete birthday");
    }

    const handleShowBirthday = () => {
        console.log("Show birthday");
    }

    return (
        <>
            <ScrollView>
                <View className="h-full w-full bg-red-700">
                    <ScrollView className="bg-green-400">
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