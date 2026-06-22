import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { ScrollView } from "react-native"
import { Text } from '@/components/ui/text';

const options = [
    {
        name: 'Notes',
        screenName: 'NotesScreen',
    },
    {
        name: 'Random',
        screenName: 'RandomScreen',
    },
    {
        name: 'Birthdays',
        screenName: 'BirthdaysScreen',
    },
    {
        name: 'Habits',
        screenName: 'HabitsScreen',
    },
    {
        name: 'Loans',
        screenName: 'LoansScreen',
    },
    {
        name: 'Entrepreneurship',
        screenName: 'EntrepreneurshipScreen',
    },
    /*
    {
        name: 'Tasks',
        screenName: 'TasksScreen',
    },
    {
        name: 'Projects',
        screenName: 'ProjectsScreen',
    },
    {
        name: 'Programing message',
        screenName: 'ProgramingMessageScreen',
    },
    */

]

export const MenuOptions = ({ navigation, handleClose }: { navigation: any, handleClose: () => void }) => {

    return (
        <ScrollView>
            {options.map((option, index) => {
                return (
                    <Box key={index}>
                        <Button className="bg-transparent" size="lg" onPress={() => {
                            handleClose();
                            navigation.navigate(option.screenName as never);
                        }}>
                            <ButtonText size="xl" className="dark:color-white color-black">
                                {option.name}
                            </ButtonText>
                        </Button>
                        <Divider className="my-1 w-5/6 mx-auto" />
                    </Box>
                )
            })}
        </ScrollView>
    )
}