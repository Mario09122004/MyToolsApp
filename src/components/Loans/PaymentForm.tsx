import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { AlertCircleIcon } from '@/components/ui/icon';
import DatePicker from 'react-native-date-picker';
import { useCRUDLoans } from '@/src/hooks/loans/useCRUDLoans';

interface PaymentFormProps {
    loanId: number;
    initialType?: 'lend' | 'pay';
    onSave: () => void;
    onClose: () => void;
}

export const PaymentForm = ({ loanId, initialType = 'lend', onSave, onClose }: PaymentFormProps) => {
    const { insertPayment } = useCRUDLoans();
    const [type, setType] = useState<'lend' | 'pay'>(initialType);
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [date, setDate] = useState(new Date());
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = async () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setErrorMessage('Please enter a valid amount greater than 0.');
            setIsError(true);
            return;
        }

        setIsError(false);
        try {
            // If they pay/discount, amount is negative. If we lend, it is positive.
            const finalAmount = type === 'pay' ? -parsedAmount : parsedAmount;
            const defaultReason = type === 'pay' ? 'Received payment' : 'Lent money';
            
            await insertPayment(
                loanId,
                finalAmount,
                reason.trim() || defaultReason,
                date.getTime()
            );
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };

    return (
        <FormControl size="md" isInvalid={isError}>
            {/* Segment Selector for Lend vs Pay */}
            <FormControlLabel>
                <FormControlLabelText>Transaction Type</FormControlLabelText>
            </FormControlLabel>
            <Box className="flex-row p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-4 border border-neutral-200 dark:border-neutral-700">
                <TouchableOpacity 
                    onPress={() => setType('lend')}
                    className={`flex-1 py-2 rounded-lg items-center ${type === 'lend' ? 'bg-red-600' : 'bg-transparent'}`}
                >
                    <Text className={`font-bold text-sm ${type === 'lend' ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                        Lend Money
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setType('pay')}
                    className={`flex-1 py-2 rounded-lg items-center ${type === 'pay' ? 'bg-green-600' : 'bg-transparent'}`}
                >
                    <Text className={`font-bold text-sm ${type === 'pay' ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                        Receive Payment / Discount
                    </Text>
                </TouchableOpacity>
            </Box>

            <FormControlLabel>
                <FormControlLabelText>Amount</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    keyboardType="numeric"
                    placeholder="Enter amount (e.g. 50)"
                    value={amount}
                    onChangeText={(text) => {
                        setAmount(text);
                        if (isError) setIsError(false);
                    }}
                />
            </Input>

            <FormControlLabel className="mt-4">
                <FormControlLabelText>Reason / Note</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    placeholder={type === 'lend' ? 'e.g. For dinner' : 'e.g. Discount / Repayment'}
                    value={reason}
                    onChangeText={setReason}
                />
            </Input>

            <FormControlLabel className="mt-4">
                <FormControlLabelText>Date</FormControlLabelText>
            </FormControlLabel>
            <Button 
                onPress={() => setDatePickerOpen(true)} 
                variant="outline" 
                action="secondary" 
                className="my-1 justify-start border-neutral-300 dark:border-neutral-700"
            >
                <ButtonText className="text-left font-normal text-typography-900">
                    {date.toLocaleDateString()}
                </ButtonText>
            </Button>

            <DatePicker
                modal
                open={datePickerOpen}
                date={date}
                mode="date"
                onConfirm={(selectedDate) => {
                    setDatePickerOpen(false);
                    setDate(selectedDate);
                }}
                onCancel={() => {
                    setDatePickerOpen(false);
                }}
            />

            {isError && (
                <FormControlError className="mt-2">
                    <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                    <FormControlErrorText className="text-red-500">
                        {errorMessage}
                    </FormControlErrorText>
                </FormControlError>
            )}

            <Button
                onPress={handleSave}
                className={`mt-6 border-none ${type === 'pay' ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' : 'bg-red-600 hover:bg-red-700 active:bg-red-800'}`}
            >
                <ButtonText className="text-white font-bold">
                    Save
                </ButtonText>
            </Button>
        </FormControl>
    );
};
