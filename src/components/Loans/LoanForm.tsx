import React, { useEffect, useState } from 'react';
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
import { useCRUDLoans } from '@/src/hooks/loans/useCRUDLoans';

interface LoanFormProps {
    editMode: boolean;
    loanId?: number;
    initialName?: string;
    onSave: () => void;
    onClose: () => void;
}

export const LoanForm = ({ editMode, loanId = 0, initialName = '', onSave, onClose }: LoanFormProps) => {
    const { insertLoan, updateLoan } = useCRUDLoans();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (editMode) {
            setName(initialName);
        } else {
            setName('');
            setAmount('');
            setReason('');
        }
    }, [editMode, initialName, loanId]);

    const handleSave = async () => {
        if (!name.trim()) {
            setErrorMessage('Please enter a valid name.');
            setIsError(true);
            return;
        }

        setIsError(false);
        try {
            if (editMode) {
                await updateLoan(loanId, name.trim());
            } else {
                const parsedAmount = parseFloat(amount);
                const initialAmt = isNaN(parsedAmount) ? 0 : parsedAmount;
                await insertLoan(
                    name.trim(),
                    initialAmt,
                    reason.trim() || 'Initial loan',
                    Date.now()
                );
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving loan:', error);
        }
    };

    return (
        <FormControl size="md" isInvalid={isError}>
            <FormControlLabel>
                <FormControlLabelText>Person Name</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
                <InputField
                    type="text"
                    placeholder="Enter person name"
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        if (isError) setIsError(false);
                    }}
                />
            </Input>

            {!editMode && (
                <>
                    <FormControlLabel className="mt-4">
                        <FormControlLabelText>Initial Loan Amount (Optional)</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="my-1" size="md">
                        <InputField
                            type="text"
                            keyboardType="numeric"
                            placeholder="Enter amount (e.g. 90)"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </Input>

                    <FormControlLabel className="mt-4">
                        <FormControlLabelText>Reason (Optional)</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="my-1" size="md">
                        <InputField
                            type="text"
                            placeholder="Reason (e.g. For food)"
                            value={reason}
                            onChangeText={setReason}
                        />
                    </Input>
                </>
            )}

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
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 mt-6 border-none"
            >
                <ButtonText className="text-white font-bold">
                    {editMode ? 'Update' : 'Register'}
                </ButtonText>
            </Button>
        </FormControl>
    );
};
