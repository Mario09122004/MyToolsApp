import { View } from "react-native"
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import {
    FormControl,
    FormControlError,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
} from '@/components/ui/form-control';
import { useState } from "react";
import { Divider } from "@/components/ui/divider";
import { Roulette } from "./Roulette";

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
        <View className="w-full p-2">
            <FormControl size="md" className="w-full p-2">
                <FormControlLabel>
                    <FormControlLabelText>Write the options.</FormControlLabelText>
                </FormControlLabel>
                <Textarea isDisabled={writeoptions}>
                    <TextareaInput 
                        placeholder={`Option 1\nOption 2\nOption 3\n...\nOption N`} 
                        className="w-full" 
                        value={options} 
                        onChangeText={(text) => textInput(text)} 
                    />
                </Textarea>
                <FormControlHelper>
                    <FormControlHelperText>Separate each option by enter.</FormControlHelperText>
                </FormControlHelper>
            </FormControl>
            <Divider />
            <Roulette options={arrayOptions} setWriteOptions={setWriteOptions} setOptions={textInput}/>
        </View>
    )
}