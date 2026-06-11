import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";

export interface IngredientInput {
    name: string;
    quantity: number;
    unit: string;
}

export interface ProductInput {
    id?: number;
    name: string;
    description: string | null;
    pricePerUnit: number;
    yieldAmount: number;
    yieldUnit: string;
    subYieldAmount: number | null;
    subYieldUnit: string | null;
}

export interface ProductWithIngredients extends schema.Product {
    ingredients: schema.Ingredient[];
}

export const useCRUDProducts = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const queryProducts = async (): Promise<ProductWithIngredients[]> => {
        const productsList = await drizzleDb.select().from(schema.products);
        const ingredientsList = await drizzleDb.select().from(schema.ingredients);
        
        return productsList.map(prod => ({
            ...prod,
            ingredients: ingredientsList.filter(ing => ing.productId === prod.id)
        }));
    };

    const queryProductById = async (id: number): Promise<ProductWithIngredients | null> => {
        const [prod] = await drizzleDb.select().from(schema.products).where(eq(schema.products.id, id));
        if (!prod) return null;
        
        const ingredientsList = await drizzleDb.select().from(schema.ingredients).where(eq(schema.ingredients.productId, id));
        return {
            ...prod,
            ingredients: ingredientsList
        };
    };

    const deleteProduct = async (id: number): Promise<void> => {
        // Delete ingredients first to enforce clean references, then delete the product
        await drizzleDb.delete(schema.ingredients).where(eq(schema.ingredients.productId, id));
        await drizzleDb.delete(schema.products).where(eq(schema.products.id, id));
    };

    const saveProductWithIngredients = async (
        productData: ProductInput,
        ingredientsList: IngredientInput[]
    ): Promise<number> => {
        const hasId = typeof productData.id === 'number' && productData.id > 0;

        if (hasId) {
            const prodId = productData.id as number;
            // Update existing product
            await drizzleDb.update(schema.products).set({
                name: productData.name,
                description: productData.description,
                pricePerUnit: productData.pricePerUnit,
                yieldAmount: productData.yieldAmount,
                yieldUnit: productData.yieldUnit,
                subYieldAmount: productData.subYieldAmount,
                subYieldUnit: productData.subYieldUnit
            }).where(eq(schema.products.id, prodId));

            // Replace ingredients: delete old, insert new
            await drizzleDb.delete(schema.ingredients).where(eq(schema.ingredients.productId, prodId));

            if (ingredientsList.length > 0) {
                await drizzleDb.insert(schema.ingredients).values(
                    ingredientsList.map(ing => ({
                        productId: prodId,
                        name: ing.name,
                        quantity: ing.quantity,
                        unit: ing.unit
                    }))
                );
            }
            return prodId;
        } else {
            // Create new product
            const [result] = await drizzleDb.insert(schema.products).values({
                name: productData.name,
                description: productData.description,
                pricePerUnit: productData.pricePerUnit,
                yieldAmount: productData.yieldAmount,
                yieldUnit: productData.yieldUnit,
                subYieldAmount: productData.subYieldAmount,
                subYieldUnit: productData.subYieldUnit
            }).returning({ id: schema.products.id });

            const newProductId = result?.id;
            if (newProductId && ingredientsList.length > 0) {
                await drizzleDb.insert(schema.ingredients).values(
                    ingredientsList.map(ing => ({
                        productId: newProductId,
                        name: ing.name,
                        quantity: ing.quantity,
                        unit: ing.unit
                    }))
                );
            }
            return newProductId;
        }
    };

    return {
        queryProducts,
        queryProductById,
        deleteProduct,
        saveProductWithIngredients
    };
};
