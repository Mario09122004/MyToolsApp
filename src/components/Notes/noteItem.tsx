import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export const NoteItem = ({ title, content, date }: { title: string; content: string; date: number }) => {
    return (
        <Card size="lg" variant="outline" className="m-2">
            <Box className="flex flex-row justify-between">
                <Heading size="xl" className="mb-1">
                    {title}
                </Heading>
                <Heading size="xs" className="mb-1 text-gray-500">
                    {new Date(date).toDateString()}
                </Heading>
            </Box>
            <Text className='line-clamp-3'>{content}</Text>
        </Card>
    )
}