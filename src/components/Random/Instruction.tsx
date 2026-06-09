import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";

export const Instruction = () => {
    return (
        <Box className="items-center mb-6 mt-2">
            <Heading size="xl" className="text-typography-950 font-extrabold tracking-tight">
                Decision Roulette
            </Heading>
            <Text className="text-typography-500 text-center mt-1.5 text-sm max-w-[290px]">
                Type your options below, separating each one with a new line.
            </Text>
        </Box>
    );
};