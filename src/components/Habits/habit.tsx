import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export default function Habit({ Title, Description } : { Title:string, Description:string }) {
    return (
        <Box className="w-full rounded-md border h-20 flex-row justify-between ">
            <Box>
                <Text size="lg" className="font-semibold">{Title}</Text>
                <Text size="sm" className="text-typography-500 font-medium">{Description}</Text>
            </Box>
            <Box>
                <Box className="bg-green-500 w-10 h-10 rounded-xl"></Box>
            </Box>
        </Box>
    );
}