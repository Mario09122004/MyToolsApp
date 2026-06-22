import React from 'react';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable } from 'react-native';
import { LoanWithBalance } from '@/src/hooks/loans/useCRUDLoans';

interface LoanItemProps {
    loan: LoanWithBalance;
    onPress: (loan: LoanWithBalance) => void;
    onLongPress: (loan: LoanWithBalance) => void;
}

export const LoanItem = ({ loan, onPress, onLongPress }: LoanItemProps) => {
    const isDebt = loan.totalBalance > 0;
    const isOverpaid = loan.totalBalance < 0;
    const balanceColor = isDebt 
        ? 'text-red-600 dark:text-red-400 font-bold' 
        : (isOverpaid ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-green-600 dark:text-green-400 font-semibold');

    const balanceText = isOverpaid 
        ? `-$${Math.abs(loan.totalBalance).toFixed(2)}` 
        : `$${loan.totalBalance.toFixed(2)}`;

    return (
        <Pressable 
            onPress={() => onPress(loan)} 
            onLongPress={() => onLongPress(loan)}
        >
            <Card size="lg" variant="outline" className="m-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <Box className="flex flex-row justify-between items-center py-1">
                    <Heading size="md" className="text-typography-900 font-bold">
                        {loan.name}
                    </Heading>
                    <Box className="items-end">
                        <Text size="xs" className="text-typography-400 uppercase font-bold tracking-wider mb-0.5">
                            {isDebt ? 'Owes' : (isOverpaid ? 'Overpaid' : 'Settled')}
                        </Text>
                        <Heading size="md" className={balanceColor}>
                            {balanceText}
                        </Heading>
                    </Box>
                </Box>
            </Card>
        </Pressable>
    );
};
