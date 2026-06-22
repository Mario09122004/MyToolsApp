import React from 'react';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable } from 'react-native';
import { LoanPayment } from '@/db/schema';

interface PaymentItemProps {
    payment: LoanPayment;
    onLongPress: (payment: LoanPayment) => void;
}

export const PaymentItem = ({ payment, onLongPress }: PaymentItemProps) => {
    const isLend = payment.amount > 0;
    const amountColor = isLend 
        ? 'text-red-600 dark:text-red-400 font-semibold' 
        : 'text-green-600 dark:text-green-400 font-semibold';

    const formattedDate = new Date(payment.date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const amountText = isLend 
        ? `+$${payment.amount.toFixed(2)}` 
        : `-$${Math.abs(payment.amount).toFixed(2)}`;

    return (
        <Pressable onLongPress={() => onLongPress(payment)}>
            <Card size="sm" variant="outline" className="my-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-3">
                <Box className="flex-row justify-between items-center">
                    <Box className="flex-1 pr-4">
                        <Text size="sm" className="font-semibold text-typography-900">
                            {payment.reason || (isLend ? 'Lent money' : 'Received payment')}
                        </Text>
                        <Text size="xs" className="text-typography-400 mt-1">
                            {formattedDate}
                        </Text>
                    </Box>
                    <Box className="items-end">
                        <Text size="xs" className="text-typography-400 uppercase font-bold tracking-wider mb-0.5">
                            {isLend ? 'Lent' : 'Paid'}
                        </Text>
                        <Heading size="sm" className={amountColor}>
                            {amountText}
                        </Heading>
                    </Box>
                </Box>
            </Card>
        </Pressable>
    );
};
