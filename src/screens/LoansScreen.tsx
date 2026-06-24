import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { Card } from '@/components/ui/card';
import { Input, InputField } from '@/components/ui/input';
import { 
    Icon, 
    CloseIcon, 
    TrashIcon, 
    InfoIcon, 
    AddIcon, 
    ArrowLeftIcon, 
    EditIcon 
} from '@/components/ui/icon';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from '@/components/ui/modal';
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
} from '@/components/ui/alert-dialog';

// Hooks and helpers
import { name_Screen } from '../helpers/name_screen';
import { useCRUDLoans, LoanWithBalance } from '../hooks/loans/useCRUDLoans';
import { LoanPayment } from '@/db/schema';

// Components
import { LoanItem } from '../components/Loans/LoanItem';
import { PaymentItem } from '../components/Loans/PaymentItem';
import { LoanForm } from '../components/Loans/LoanForm';
import { PaymentForm } from '../components/Loans/PaymentForm';

export default function LoansScreen() {
    const { changeNameScreen } = name_Screen();
    const { queryLoansWithBalance, queryPaymentsByLoanId, deleteLoan, deletePayment } = useCRUDLoans();

    // Screen Setup
    useEffect(() => {
        changeNameScreen("Loans");
    }, []);

    // State
    const [dataLoans, setDataLoans] = useState<LoanWithBalance[]>([]);
    const [selectedLoan, setSelectedLoan] = useState<LoanWithBalance | null>(null);
    const [payments, setPayments] = useState<LoanPayment[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal & Dialog state
    const [loanModalVisible, setLoanModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [deleteLoanConfirmVisible, setDeleteLoanConfirmVisible] = useState(false);
    const [deletePaymentConfirmVisible, setDeletePaymentConfirmVisible] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState<LoanPayment | null>(null);

    // Fetch Loans from db
    const fetchLoans = async () => {
        try {
            const list = await queryLoansWithBalance();
            setDataLoans(list);
            
            // If a loan is currently selected, refresh its details/payments too
            if (selectedLoan) {
                const updatedSelected = list.find(l => l.id === selectedLoan.id);
                if (updatedSelected) {
                    setSelectedLoan(updatedSelected);
                } else {
                    setSelectedLoan(null);
                }
            }
        } catch (error) {
            console.error("Error fetching loans:", error);
        }
    };

    // Fetch Payments for selected loan
    const fetchPayments = async (loanId: number) => {
        try {
            const list = await queryPaymentsByLoanId(loanId);
            setPayments(list);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    useEffect(() => {
        if (selectedLoan) {
            fetchPayments(selectedLoan.id);
        } else {
            setPayments([]);
        }
    }, [selectedLoan]);

    // Handle Actions
    const handleNewLoan = () => {
        setEditMode(false);
        setLoanModalVisible(true);
    };

    const handleLoanClick = (loan: LoanWithBalance) => {
        setSelectedLoan(loan);
    };

    const handleLoanLongPress = (loan: LoanWithBalance) => {
        setSelectedLoan(loan);
        setDeleteLoanConfirmVisible(true);
    };

    const handleConfirmDeleteLoan = async () => {
        if (selectedLoan) {
            try {
                await deleteLoan(selectedLoan.id);
                setSelectedLoan(null);
                await fetchLoans();
            } catch (error) {
                console.error("Error deleting loan:", error);
            }
        }
        setDeleteLoanConfirmVisible(false);
    };

    const handlePaymentLongPress = (payment: LoanPayment) => {
        setPaymentToDelete(payment);
        setDeletePaymentConfirmVisible(true);
    };

    const handleConfirmDeletePayment = async () => {
        if (paymentToDelete) {
            try {
                await deletePayment(paymentToDelete.id);
                if (selectedLoan) {
                    await fetchPayments(selectedLoan.id);
                }
                await fetchLoans();
            } catch (error) {
                console.error("Error deleting payment:", error);
            }
        }
        setDeletePaymentConfirmVisible(false);
        setPaymentToDelete(null);
    };

    // Calculate totals
    const totalOutstanding = dataLoans.reduce((sum, l) => sum + l.totalBalance, 0);
    const filteredLoans = dataLoans.filter(l => 
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Detail View Calculations
    const detailBalance = payments.reduce((sum, p) => sum + p.amount, 0);
    const isDebt = detailBalance > 0;
    const isOverpaid = detailBalance < 0;
    const balanceColor = isDebt 
        ? 'text-red-600 dark:text-red-400 font-extrabold' 
        : (isOverpaid ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-green-600 dark:text-green-400 font-bold');
    
    const balanceText = isOverpaid 
        ? `-$${Math.abs(detailBalance).toFixed(2)}` 
        : `$${detailBalance.toFixed(2)}`;

    return (
        <Box className="flex-1 bg-neutral-50 dark:bg-neutral-950">
            {selectedLoan === null ? (
                // MASTER / OVERVIEW STATE
                <>
                    {/* Sum of outstanding loans card */}
                    <Card size="md" variant="filled" className="m-4 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 rounded-2xl">
                        <Box className="flex-row justify-between items-center py-2 px-3">
                            <Box>
                                <Text size="xs" className="text-red-700 dark:text-red-300 font-bold uppercase tracking-wider">Total Money Lent</Text>
                                <Heading size="2xl" className="text-red-800 dark:text-red-200 font-extrabold mt-1">
                                    ${totalOutstanding.toFixed(2)}
                                </Heading>
                            </Box>
                            <Box className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/40 items-center justify-center">
                                <Icon as={InfoIcon} size="xl" className="text-red-600 dark:text-red-400" />
                            </Box>
                        </Box>
                    </Card>

                    {/* Search Input */}
                    <Box className="px-4 mb-3">
                        <Input className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" size="md">
                            <InputField
                                type="text"
                                placeholder="Search person..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                className="text-typography-900"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')} className="justify-center px-3">
                                    <Icon as={CloseIcon} size="sm" className="text-neutral-400" />
                                </TouchableOpacity>
                            )}
                        </Input>
                    </Box>

                    {/* List of People */}
                    <ScrollView className="flex-1 px-2" showsVerticalScrollIndicator={false}>
                        <Box className="pb-24">
                            {filteredLoans.length > 0 ? (
                                filteredLoans.map((loan) => (
                                    <LoanItem 
                                        key={loan.id}
                                        loan={loan}
                                        onPress={handleLoanClick}
                                        onLongPress={handleLoanLongPress}
                                    />
                                ))
                            ) : (
                                <Box className="items-center justify-center px-4 py-20">
                                    <Box className="w-full py-20 items-center justify-center bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl p-6">
                                        <Box className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center mb-3">
                                            <Icon as={InfoIcon} size="xl" className="text-red-600 dark:text-red-500" />
                                        </Box>
                                        <Text className="text-typography-500 font-semibold text-center text-base">
                                            {searchQuery ? 'No results found' : 'No loans registered yet'}
                                        </Text>
                                        <Text className="text-typography-400 text-center mt-1 text-sm px-4">
                                            {searchQuery 
                                                ? 'Try searching for another name.' 
                                                : 'Press the "Register" button to start keeping track of loans.'}
                                        </Text>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </ScrollView>

                    {/* Floating Add Person Button */}
                    <Fab
                        size="lg"
                        placement="bottom right"
                        onPress={handleNewLoan}
                        className="absolute bottom-6 right-4 bg-red-600 hover:bg-red-700 active:bg-red-800 border-none rounded-full"
                    >
                        <FabIcon as={AddIcon} />
                        <FabLabel>Register</FabLabel>
                    </Fab>
                </>
            ) : (
                // DETAIL STATE
                <>
                    {/* Back header bar */}
                    <Box className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        <Box className="flex-row items-center flex-1">
                            <TouchableOpacity onPress={() => setSelectedLoan(null)} className="p-2 -ml-2 mr-2">
                                <Icon as={ArrowLeftIcon} size="xl" className="text-neutral-800 dark:text-neutral-200" />
                            </TouchableOpacity>
                            <Box className="flex-1">
                                <Heading size="md" className="text-typography-900 font-bold" numberOfLines={1}>
                                    {selectedLoan.name}
                                </Heading>
                            </Box>
                        </Box>
                        <Box className="flex-row items-center">
                            <TouchableOpacity 
                                onPress={() => { setEditMode(true); setLoanModalVisible(true); }} 
                                className="p-2.5 mr-1 bg-neutral-100 dark:bg-neutral-800 rounded-full"
                            >
                                <Icon as={EditIcon} size="sm" className="text-neutral-600 dark:text-neutral-300" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setDeleteLoanConfirmVisible(true)} 
                                className="p-2.5 bg-red-50 dark:bg-red-950/20 rounded-full"
                            >
                                <Icon as={TrashIcon} size="sm" className="text-red-600 dark:text-red-400" />
                            </TouchableOpacity>
                        </Box>
                    </Box>

                    {/* Balance Card */}
                    <Card size="md" variant="filled" className="m-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                        <Box className="items-center py-2">
                            <Text size="xs" className="text-typography-400 uppercase font-bold tracking-wider mb-1">
                                {isDebt ? 'Outstanding Debt' : (isOverpaid ? 'Overpaid Balance' : 'Settled Balance')}
                            </Text>
                            <Heading size="3xl" className={balanceColor}>
                                {balanceText}
                            </Heading>
                        </Box>
                    </Card>

                    {/* Section Header */}
                    <Box className="px-4 py-2">
                        <Heading size="xs" className="text-typography-400 uppercase font-bold tracking-wider">
                            Transaction History
                        </Heading>
                    </Box>

                    {/* Payments Scroll List */}
                    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                        <Box className="pb-24">
                            {payments.length > 0 ? (
                                payments.map((payment) => (
                                    <PaymentItem 
                                        key={payment.id}
                                        payment={payment}
                                        onLongPress={handlePaymentLongPress}
                                    />
                                ))
                            ) : (
                                <Box className="items-center justify-center py-12 bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                                    <Text className="text-typography-400 text-center font-medium">
                                        No transactions recorded yet.
                                    </Text>
                                    <Text className="text-typography-300 text-center text-xs mt-1">
                                        Tap the "+" button below to log a loan or payment.
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </ScrollView>

                    {/* Floating Add Transaction Button */}
                    <Fab
                        size="lg"
                        placement="bottom right"
                        onPress={() => setPaymentModalVisible(true)}
                        className="absolute bottom-6 right-4 bg-red-600 hover:bg-red-700 active:bg-red-800 border-none rounded-full"
                    >
                        <FabIcon as={AddIcon} />
                        <FabLabel>Transaction</FabLabel>
                    </Fab>
                </>
            )}

            {/* Modals & Dialogs */}

            {/* Loan Register/Edit Modal */}
            <Modal
                isOpen={loanModalVisible}
                onClose={() => setLoanModalVisible(false)}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="border-b pb-3 relative">
                        <Heading size="lg" className="text-typography-900 font-bold">
                            {editMode ? "Rename Person" : "Register Loan"}
                        </Heading>
                        <ModalCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="py-4">
                        <LoanForm 
                            editMode={editMode}
                            loanId={selectedLoan?.id}
                            initialName={selectedLoan?.name}
                            onSave={fetchLoans}
                            onClose={() => setLoanModalVisible(false)}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Payment Transaction Modal */}
            {selectedLoan && (
                <Modal
                    isOpen={paymentModalVisible}
                    onClose={() => setPaymentModalVisible(false)}
                    size="lg"
                >
                    <ModalBackdrop />
                    <ModalContent>
                        <ModalHeader className="border-b pb-3 relative">
                            <Heading size="lg" className="text-typography-900 font-bold">
                                Add Transaction
                            </Heading>
                            <ModalCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Icon as={CloseIcon} />
                            </ModalCloseButton>
                        </ModalHeader>
                        <ModalBody className="py-4">
                            <PaymentForm 
                                loanId={selectedLoan.id}
                                onSave={async () => {
                                    await fetchPayments(selectedLoan.id);
                                    await fetchLoans();
                                }}
                                onClose={() => setPaymentModalVisible(false)}
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}

            {/* Delete Loan Confirmation AlertDialog */}
            <AlertDialog isOpen={deleteLoanConfirmVisible} onClose={() => setDeleteLoanConfirmVisible(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md" className="text-typography-900 font-bold">Delete Loan Account?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center text-typography-600">
                            This will permanently delete {selectedLoan?.name}'s account and all associated transaction records. This action cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5 gap-3 w-full flex-row justify-center">
                        <Button
                            size="sm"
                            onPress={handleConfirmDeleteLoan}
                            className="px-[30px] bg-red-600 active:bg-red-700 hover:bg-red-700 border-none"
                        >
                            <ButtonText className="font-bold text-white">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={() => setDeleteLoanConfirmVisible(false)}
                            size="sm"
                            className="px-[30px] border-neutral-300 dark:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900"
                        >
                            <ButtonText className="font-bold text-typography-700">Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Transaction Payment Confirmation AlertDialog */}
            <AlertDialog isOpen={deletePaymentConfirmVisible} onClose={() => setDeletePaymentConfirmVisible(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md" className="text-typography-900 font-bold">Delete Transaction?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center text-typography-600">
                            This transaction will be permanently removed, and the total balance will be recalculated. This action cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5 gap-3 w-full flex-row justify-center">
                        <Button
                            size="sm"
                            onPress={handleConfirmDeletePayment}
                            className="px-[30px] bg-red-600 active:bg-red-700 hover:bg-red-700 border-none"
                        >
                            <ButtonText className="font-bold text-white">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={() => setDeletePaymentConfirmVisible(false)}
                            size="sm"
                            className="px-[30px] border-neutral-300 dark:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900"
                        >
                            <ButtonText className="font-bold text-typography-700">Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Box>
    );
}