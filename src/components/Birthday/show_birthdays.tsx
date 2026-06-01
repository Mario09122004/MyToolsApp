import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';

export default function ShowBirthdays({ handleDeleteBirthday, handleShowBirthday } : { handleShowBirthday: () => void, handleDeleteBirthday: () => void}) {
    return (
        <>
        <Pressable 
            onLongPress={handleDeleteBirthday}
            onPress={handleShowBirthday}
        >
            <Card size="lg" variant="outline" className="m-2">
                <Box className="flex flex-row justify-between">
                    <Heading size="xl" className="mb-1">
                        Pyra's birthday
                    </Heading>
                    <Heading size="xs" className="mb-1 text-gray-500">
                        16 de septiembre
                    </Heading>
                </Box>
                <Box className='flex-row justify-between'>
                    <Text className='line-clamp-3'>
                        22 years old
                    </Text>
                    <Text className='line-clamp-3'>
                        Left 10 days
                    </Text>
                </Box>
            </Card>
        </Pressable>
        </>
    )
}