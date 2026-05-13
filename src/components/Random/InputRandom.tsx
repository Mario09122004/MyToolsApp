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

export const InputRandom = () => {
    const [options, setOptions] = useState("")

    const textInput = (text: string) => {
        setOptions(text);
        handleSeparateOptions(text)
    }

    const handleSeparateOptions = (text: string) => {
        console.log("Texto: ", text);
        const opciones = text.split("\n")
        console.log("Texto separado: ", opciones);
        console.log("cantidad de opciones: ", opciones.length)
    }

    return (
        <View className="w-full p-2">
            <FormControl size="md" className="w-full p-2">
                <FormControlLabel>
                    <FormControlLabelText>Write the options.</FormControlLabelText>
                </FormControlLabel>
                <Textarea>
                    <TextareaInput placeholder="Option 1, \n Option 2, \n Option 3 ..." className="w-full" value={options} onChangeText={(text) => textInput(text)} />
                </Textarea>
                <FormControlHelper>
                    <FormControlHelperText>Separate each option by enter.</FormControlHelperText>
                </FormControlHelper>
            </FormControl>
        </View>
    )
}