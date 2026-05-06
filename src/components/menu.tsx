import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { ScrollView } from "react-native"
import { Text } from '@/components/ui/text';

const options = [
    {
        name: 'Notes',
        icon: 'tasks',
        action: () => console.log('Go to Notes')
    },
    {
        name: 'Birthdays',
        icon: 'settings',
        action: () => console.log('Go to Birthdays')
    },
    {
        name: 'Habits',
        icon: 'info',
        action: () => console.log('Go to Habits')
    },
    {
        name: 'Tasks',
        icon: 'info',
        action: () => console.log('Go to Tasks')
    },
    {
        name: 'Projects',
        icon: 'info',
        action: () => console.log('Go to Projects')
    },
    {
        name: 'Loans',
        icon: 'info',
        action: () => console.log('Go to Loans')
    },
    {
        name: 'Programing message',
        icon: 'info',
        action: () => console.log('Go to Programing message')
    },
    {
        name: 'Entrepreneurship',
        icon: 'info',
        action: () => console.log('Go to Entrepreneurship')
    }
]
export const MenuOptions = () => {
    return (
        <ScrollView>
            {options.map((option, index) => {
                return (
                    <Box key={index}>
                        <Button onPress={option.action} className="bg-transparent" size="lg">
                            <ButtonText size="xl" className="dark:color-white color-black">
                                {option.name}
                            </ButtonText>
                        </Button>
                        <Divider className="my-1 w-5/6 mx-auto" />
                    </Box>
                )
            })}
            <Text className="text-right">
                Mario was here
            </Text>
        </ScrollView>
    )
}