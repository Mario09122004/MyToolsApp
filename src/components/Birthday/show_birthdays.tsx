import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Birthday } from '@/db/schema';
import { formatBirthdayDate, calculateAge, calculateRemainingDays } from '@/src/utils/birthdayHelpers';

export default function ShowBirthdays({ 
    birthday, 
    handleDeleteBirthday, 
    handleShowBirthday 
}: { 
    birthday: Birthday;
    handleShowBirthday: (id: number) => void;
    handleDeleteBirthday: (id: number) => void;
}) {
    const formattedDate = formatBirthdayDate(birthday.date);
    const age = calculateAge(birthday.date);
    const remainingDays = calculateRemainingDays(birthday.date);

    const ageText = `${age} años`;
    let remainingText = '';
    if (remainingDays === 0) {
        remainingText = '¡Hoy! 🎂';
    } else if (remainingDays === 1) {
        remainingText = 'Falta 1 día';
    } else {
        remainingText = `Faltan ${remainingDays} días`;
    }

    return (
        <Pressable 
            onLongPress={() => handleDeleteBirthday(birthday.id)}
            onPress={() => handleShowBirthday(birthday.id)}
        >
            <Card size="lg" variant="outline" className="m-2 bg-background-neutral border-neutral-200">
                <Box className="flex flex-row justify-between items-center">
                    <Heading size="md" className="mb-1 text-typography-900 font-bold">
                        {birthday.name}
                    </Heading>
                    <Heading size="xs" className="mb-1 text-typography-500">
                        {formattedDate}
                    </Heading>
                </Box>
                <Box className="flex-row justify-between mt-1">
                    <Text size="sm" className="text-typography-600">
                        {ageText}
                    </Text>
                    <Text size="sm" className={`font-semibold ${remainingDays === 0 ? 'text-green-600 dark:text-green-400' : 'text-typography-600'}`}>
                        {remainingText}
                    </Text>
                </Box>
            </Card>
        </Pressable>
    );
}