import { View } from "react-native"
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
} from '@/components/ui/form-control';
import { useState } from "react";
import { Roulette } from "./Roulette";
import { Box } from "@/components/ui/box";

export const InputRandom = () => {
    const [options, setOptions] = useState("");
    const [arrayOptions, setArrayOptions] = useState<String[]>([])
    const [writeoptions, setWriteOptions] = useState<boolean>(false);

    const textInput = (text: string) => {
        setOptions(text);
        handleSeparateOptions(text)
    }

    const handleSeparateOptions = (text: string) => {
        const opciones = text.split("\n")
        const cleanOptions = opciones.filter(opcion => opcion.trim() !== "");
        setArrayOptions(cleanOptions);
    }
    
    return (
        <View className="w-full flex-1">
            <FormControl size="md" className="w-full mb-4">
                <FormControlLabel className="mb-1.5">
                    <FormControlLabelText className="text-typography-800 font-bold">
                        Roulette Options
                    </FormControlLabelText>
                </FormControlLabel>
                <Textarea 
                    isDisabled={writeoptions} 
                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background-neutral p-1 min-h-[120px]"
                >
                    <TextareaInput 
                        placeholder={`Option 1\nOption 2\nOption 3`} 
                        className="w-full text-typography-900" 
                        value={options} 
                        onChangeText={(text) => textInput(text)} 
                    />
                </Textarea>
                <FormControlHelper className="mt-1">
                    <FormControlHelperText className="text-typography-400">
                        Separate each option with a new line.
                    </FormControlHelperText>
                </FormControlHelper>
            </FormControl>
            <Box className="flex-1 justify-center items-center py-2">
                <Roulette options={arrayOptions} setWriteOptions={setWriteOptions} setOptions={textInput}/>
            </Box>
        </View>
    )
}