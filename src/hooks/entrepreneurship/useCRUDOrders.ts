import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";

export interface OrderInput {
    id?: number;
    productId: number;
    customerName: string;
    quantity: number;
    dueDate: string | null;
}

export interface OrderWithProduct extends schema.Order {
    productName: string;
}

export const useCRUDOrders = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const queryOrders = async (): Promise<OrderWithProduct[]> => {
        const ordersList = await drizzleDb.select().from(schema.orders);
        const productsList = await drizzleDb.select().from(schema.products);

        return ordersList.map(order => {
            const product = productsList.find(p => p.id === order.productId);
            return {
                ...order,
                productName: product ? product.name : 'Unknown Product'
            };
        }).sort((a, b) => b.id - a.id); // Newest orders first
    };

    const deleteOrder = async (id: number): Promise<void> => {
        await drizzleDb.delete(schema.orders).where(eq(schema.orders.id, id));
    };

    const saveOrder = async (orderData: OrderInput): Promise<number> => {
        const hasId = typeof orderData.id === 'number' && orderData.id > 0;

        if (hasId) {
            const orderId = orderData.id as number;
            await drizzleDb.update(schema.orders).set({
                productId: orderData.productId,
                customerName: orderData.customerName,
                quantity: orderData.quantity,
                dueDate: orderData.dueDate
            }).where(eq(schema.orders.id, orderId));
            return orderId;
        } else {
            const [result] = await drizzleDb.insert(schema.orders).values({
                productId: orderData.productId,
                customerName: orderData.customerName,
                quantity: orderData.quantity,
                dueDate: orderData.dueDate
            }).returning({ id: schema.orders.id });
            return result?.id;
        }
    };

    return {
        queryOrders,
        deleteOrder,
        saveOrder
    };
};
