import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export const NoteItem = ({ title, content, date }: { title: string; content: string; date: number }) => {
    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <Card size="md" variant="outline" className="bg-background-neutral border-neutral-200 dark:border-neutral-800 p-4 rounded-xl">
            <Box className="flex-row justify-between items-center mb-2">
                <Heading size="md" className="text-typography-900 font-bold flex-1 pr-2">
                    {title}
                </Heading>
                <Text size="xs" className="text-typography-400 font-medium">
                    {formattedDate}
                </Text>
            </Box>
            <Text size="sm" className="text-typography-600 line-clamp-3">
                {content}
            </Text>
        </Card>
    );
};