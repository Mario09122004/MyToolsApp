import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export interface LoanWithBalance {
    id: number;
    name: string;
    totalBalance: number;
}

export const useCRUDLoans = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const queryLoansWithBalance = async (): Promise<LoanWithBalance[]> => {
        const result = await drizzleDb.select({
            id: schema.loan.id,
            name: schema.loan.name,
            totalBalance: sql<number>`coalesce(sum(${schema.loanPayments.amount}), 0)`
        })
        .from(schema.loan)
        .leftJoin(schema.loanPayments, eq(schema.loan.id, schema.loanPayments.loanId))
        .groupBy(schema.loan.id);

        return result;
    };

    const queryPaymentsByLoanId = async (loanId: number): Promise<schema.LoanPayment[]> => {
        return await drizzleDb.select()
            .from(schema.loanPayments)
            .where(eq(schema.loanPayments.loanId, loanId))
            .orderBy(sql`${schema.loanPayments.date} DESC`);
    };

    const insertLoan = async (
        name: string, 
        initialAmount?: number, 
        initialReason?: string, 
        initialDate?: number
    ): Promise<number> => {
        const res = await drizzleDb.insert(schema.loan).values({ name });
        const newLoanId = res.lastInsertRowId;
        
        if (initialAmount && initialAmount !== 0) {
            await drizzleDb.insert(schema.loanPayments).values({
                loanId: newLoanId,
                amount: initialAmount,
                reason: initialReason || "Initial loan",
                date: initialDate || Date.now()
            });
        }
        return newLoanId;
    };

    const updateLoan = async (id: number, name: string) => {
        return await drizzleDb.update(schema.loan)
            .set({ name })
            .where(eq(schema.loan.id, id));
    };

    const deleteLoan = async (id: number) => {
        return await drizzleDb.delete(schema.loan)
            .where(eq(schema.loan.id, id));
    };

    const insertPayment = async (
        loanId: number, 
        amount: number, 
        reason: string = "", 
        date: number = Date.now()
    ) => {
        return await drizzleDb.insert(schema.loanPayments).values({
            loanId,
            amount,
            reason,
            date
        });
    };

    const deletePayment = async (id: number) => {
        return await drizzleDb.delete(schema.loanPayments)
            .where(eq(schema.loanPayments.id, id));
    };

    return {
        queryLoansWithBalance,
        queryPaymentsByLoanId,
        insertLoan,
        updateLoan,
        deleteLoan,
        insertPayment,
        deletePayment
    };
};
