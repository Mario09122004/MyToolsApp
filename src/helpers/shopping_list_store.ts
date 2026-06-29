import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { openDatabaseSync } from 'expo-sqlite';

// Persistent storage using expo-sqlite to avoid installing external storage libraries (like async-storage)
const DATABASE_NAME = 'tasks.db';
const db = openDatabaseSync(DATABASE_NAME);

let isInitialized = false;

const ensureTableExists = () => {
    if (isInitialized) return;
    try {
        db.execSync(`
            CREATE TABLE IF NOT EXISTS key_value_store (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);
        isInitialized = true;
    } catch (err) {
        console.error("Failed to initialize key_value_store table:", err);
    }
};

const sqliteStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        ensureTableExists();
        try {
            const result = await db.getFirstAsync<{ value: string }>(
                'SELECT value FROM key_value_store WHERE key = ?',
                [name]
            );
            return result ? result.value : null;
        } catch (err) {
            console.error(`Failed to get item ${name} from SQLite storage:`, err);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        ensureTableExists();
        try {
            await db.runAsync(
                'INSERT OR REPLACE INTO key_value_store (key, value) VALUES (?, ?)',
                [name, value]
            );
        } catch (err) {
            console.error(`Failed to set item ${name} in SQLite storage:`, err);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        ensureTableExists();
        try {
            await db.runAsync('DELETE FROM key_value_store WHERE key = ?', [name]);
        } catch (err) {
            console.error(`Failed to remove item ${name} from SQLite storage:`, err);
        }
    },
};

interface ShoppingListState {
    plan: { [productId: number]: number };
    ownedIngredients: { [key: string]: number };
    setPlanQty: (productId: number, qty: number) => void;
    incrementPlanQty: (productId: number) => void;
    decrementPlanQty: (productId: number) => void;
    setOwnedQty: (key: string, qty: number) => void;
    incrementOwnedQty: (key: string, step: number, target: number) => void;
    decrementOwnedQty: (key: string, step: number) => void;
    resetPlan: () => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
    persist(
        (set) => ({
            plan: {},
            ownedIngredients: {},

            setPlanQty: (productId, qty) => set((state) => {
                const next = Math.max(0, qty);
                const newPlan = { ...state.plan };
                if (next === 0) {
                    delete newPlan[productId];
                } else {
                    newPlan[productId] = next;
                }
                const isPlanEmpty = Object.keys(newPlan).length === 0;
                return {
                    plan: newPlan,
                    ownedIngredients: isPlanEmpty ? {} : state.ownedIngredients
                };
            }),

            incrementPlanQty: (productId) => set((state) => {
                const current = state.plan[productId] || 0;
                return {
                    plan: { ...state.plan, [productId]: current + 1 }
                };
            }),

            decrementPlanQty: (productId) => set((state) => {
                const current = state.plan[productId] || 0;
                const next = Math.max(0, current - 1);
                // Clean up the key if it drops to 0 to keep the plan clean
                const newPlan = { ...state.plan };
                if (next === 0) {
                    delete newPlan[productId];
                } else {
                    newPlan[productId] = next;
                }
                const isPlanEmpty = Object.keys(newPlan).length === 0;
                return {
                    plan: newPlan,
                    ownedIngredients: isPlanEmpty ? {} : state.ownedIngredients
                };
            }),

            setOwnedQty: (key, qty) => set((state) => ({
                ownedIngredients: { ...state.ownedIngredients, [key]: Math.max(0, qty) }
            })),

            incrementOwnedQty: (key, step, target) => set((state) => {
                const current = state.ownedIngredients[key] || 0;
                const next = Math.min(target, Number((current + step).toFixed(2)));
                return {
                    ownedIngredients: { ...state.ownedIngredients, [key]: next }
                };
            }),

            decrementOwnedQty: (key, step) => set((state) => {
                const current = state.ownedIngredients[key] || 0;
                const next = Math.max(0, Number((current - step).toFixed(2)));
                return {
                    ownedIngredients: { ...state.ownedIngredients, [key]: next }
                };
            }),

            resetPlan: () => set(() => ({
                plan: {},
                ownedIngredients: {}
            }))
        }),
        {
            name: 'shopping-list-storage',
            storage: createJSONStorage(() => sqliteStorage),
        }
    )
);
