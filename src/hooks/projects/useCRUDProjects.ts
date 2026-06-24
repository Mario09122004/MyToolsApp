import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { eq, sql, and, lt, gt, desc, asc } from 'drizzle-orm';

export interface ProjectWithStats {
    id: number;
    name: string;
    description: string | null;
    dueday: number;
    totalTasks: number;
    completedTasks: number;
}

export const useCRUDProjects = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const checkAndUpdatePhaseCompletion = async (phaseId: number) => {
        const tasks = await drizzleDb.select()
            .from(schema.taskPerPhase)
            .where(eq(schema.taskPerPhase.phaseId, phaseId));
        
        if (tasks.length > 0) {
            const allCompleted = tasks.every(t => t.completed);
            
            const phaseResult = await drizzleDb.select({ completed: schema.phases.completed })
                .from(schema.phases)
                .where(eq(schema.phases.id, phaseId))
                .limit(1);
            
            if (phaseResult.length > 0 && phaseResult[0].completed !== allCompleted) {
                await drizzleDb.update(schema.phases)
                    .set({ completed: allCompleted })
                    .where(eq(schema.phases.id, phaseId));
            }
        }
    };

    // --- PROJECTS ---
    
    const queryProjects = async (): Promise<ProjectWithStats[]> => {
        const result = await drizzleDb.select({
            id: schema.project.id,
            name: schema.project.name,
            description: schema.project.description,
            dueday: schema.project.dueday,
            totalTasks: sql<number>`coalesce((
                select count(*) from taskPerPhase t
                join phases p on t.phaseId = p.id
                where p.projectId = project.id
            ), 0)`,
            completedTasks: sql<number>`coalesce((
                select count(*) from taskPerPhase t
                join phases p on t.phaseId = p.id
                where p.projectId = project.id and t.completed = 1
            ), 0)`
        })
        .from(schema.project);

        return result;
    };

    const queryProjectById = async (id: number): Promise<schema.Project[]> => {
        return await drizzleDb.select()
            .from(schema.project)
            .where(eq(schema.project.id, id))
            .limit(1);
    };

    const insertProject = async (name: string, description: string | null, dueday: number): Promise<number> => {
        const res = await drizzleDb.insert(schema.project).values({
            name,
            description,
            dueday
        });
        return res.lastInsertRowId;
    };

    const updateProject = async (id: number, name: string, description: string | null, dueday: number) => {
        return await drizzleDb.update(schema.project)
            .set({ name, description, dueday })
            .where(eq(schema.project.id, id));
    };

    const deleteProject = async (id: number) => {
        return await drizzleDb.delete(schema.project)
            .where(eq(schema.project.id, id));
    };

    // --- PHASES ---

    const queryPhasesByProjectId = async (projectId: number): Promise<schema.Phase[]> => {
        return await drizzleDb.select()
            .from(schema.phases)
            .where(eq(schema.phases.projectId, projectId))
            .orderBy(asc(schema.phases.order));
    };

    const insertPhase = async (projectId: number, name: string, description: string | null, dueday: number): Promise<number> => {
        // Calculate the next order
        const maxOrderResult = await drizzleDb.select({
            maxOrder: sql<number>`coalesce(max(${schema.phases.order}), -1)`
        })
        .from(schema.phases)
        .where(eq(schema.phases.projectId, projectId));
        
        const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

        const res = await drizzleDb.insert(schema.phases).values({
            projectId,
            name,
            description,
            completed: false,
            dueday,
            order: nextOrder
        });
        return res.lastInsertRowId;
    };

    const updatePhase = async (
        id: number, 
        name: string, 
        description: string | null, 
        completed: boolean, 
        dueday: number
    ) => {
        const res = await drizzleDb.update(schema.phases)
            .set({ name, description, completed, dueday })
            .where(eq(schema.phases.id, id));

        // Update all tasks under this phase to match this completed status
        await drizzleDb.update(schema.taskPerPhase)
            .set({ completed })
            .where(eq(schema.taskPerPhase.phaseId, id));

        return res;
    };

    const deletePhase = async (id: number) => {
        return await drizzleDb.delete(schema.phases)
            .where(eq(schema.phases.id, id));
    };

    const movePhase = async (id: number, direction: 'up' | 'down') => {
        const currentPhase = await drizzleDb.select()
            .from(schema.phases)
            .where(eq(schema.phases.id, id))
            .limit(1);
            
        if (currentPhase.length === 0) return;
        
        const { projectId, order: currentOrder } = currentPhase[0];
        
        let siblingQuery;
        if (direction === 'up') {
            siblingQuery = drizzleDb.select()
                .from(schema.phases)
                .where(and(
                    eq(schema.phases.projectId, projectId),
                    lt(schema.phases.order, currentOrder)
                ))
                .orderBy(desc(schema.phases.order))
                .limit(1);
        } else {
            siblingQuery = drizzleDb.select()
                .from(schema.phases)
                .where(and(
                    eq(schema.phases.projectId, projectId),
                    gt(schema.phases.order, currentOrder)
                ))
                .orderBy(asc(schema.phases.order))
                .limit(1);
        }

        const sibling = await siblingQuery;
        if (sibling.length === 0) return;

        const siblingId = sibling[0].id;
        const siblingOrder = sibling[0].order;

        // Swap orders
        await drizzleDb.update(schema.phases)
            .set({ order: siblingOrder })
            .where(eq(schema.phases.id, id));
            
        await drizzleDb.update(schema.phases)
            .set({ order: currentOrder })
            .where(eq(schema.phases.id, siblingId));
    };

    // --- TASKS PER PHASE ---

    const queryTasksByPhaseId = async (phaseId: number): Promise<schema.TaskPerPhase[]> => {
        return await drizzleDb.select()
            .from(schema.taskPerPhase)
            .where(eq(schema.taskPerPhase.phaseId, phaseId))
            .orderBy(asc(schema.taskPerPhase.order));
    };

    const insertTask = async (phaseId: number, taskName: string, description: string | null, dueday: number): Promise<number> => {
        // Calculate the next order
        const maxOrderResult = await drizzleDb.select({
            maxOrder: sql<number>`coalesce(max(${schema.taskPerPhase.order}), -1)`
        })
        .from(schema.taskPerPhase)
        .where(eq(schema.taskPerPhase.phaseId, phaseId));

        const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

        const res = await drizzleDb.insert(schema.taskPerPhase).values({
            phaseId,
            taskName,
            description,
            completed: false,
            dueday,
            order: nextOrder
        });

        // Since a new task is inserted as incomplete, the phase must be incomplete
        await drizzleDb.update(schema.phases)
            .set({ completed: false })
            .where(eq(schema.phases.id, phaseId));

        return res.lastInsertRowId;
    };

    const updateTask = async (
        id: number, 
        taskName: string, 
        description: string | null, 
        completed: boolean, 
        dueday: number
    ) => {
        const taskResult = await drizzleDb.select({ phaseId: schema.taskPerPhase.phaseId })
            .from(schema.taskPerPhase)
            .where(eq(schema.taskPerPhase.id, id))
            .limit(1);

        const res = await drizzleDb.update(schema.taskPerPhase)
            .set({ taskName, description, completed, dueday })
            .where(eq(schema.taskPerPhase.id, id));

        if (taskResult.length > 0) {
            await checkAndUpdatePhaseCompletion(taskResult[0].phaseId);
        }
        return res;
    };

    const deleteTask = async (id: number) => {
        const taskResult = await drizzleDb.select({ phaseId: schema.taskPerPhase.phaseId })
            .from(schema.taskPerPhase)
            .where(eq(schema.taskPerPhase.id, id))
            .limit(1);

        const res = await drizzleDb.delete(schema.taskPerPhase)
            .where(eq(schema.taskPerPhase.id, id));

        if (taskResult.length > 0) {
            await checkAndUpdatePhaseCompletion(taskResult[0].phaseId);
        }
        return res;
    };

    const moveTask = async (id: number, direction: 'up' | 'down') => {
        const currentTask = await drizzleDb.select()
            .from(schema.taskPerPhase)
            .where(eq(schema.taskPerPhase.id, id))
            .limit(1);
            
        if (currentTask.length === 0) return;
        
        const { phaseId, order: currentOrder } = currentTask[0];
        
        let siblingQuery;
        if (direction === 'up') {
            siblingQuery = drizzleDb.select()
                .from(schema.taskPerPhase)
                .where(and(
                    eq(schema.taskPerPhase.phaseId, phaseId),
                    lt(schema.taskPerPhase.order, currentOrder)
                ))
                .orderBy(desc(schema.taskPerPhase.order))
                .limit(1);
        } else {
            siblingQuery = drizzleDb.select()
                .from(schema.taskPerPhase)
                .where(and(
                    eq(schema.taskPerPhase.phaseId, phaseId),
                    gt(schema.taskPerPhase.order, currentOrder)
                ))
                .orderBy(asc(schema.taskPerPhase.order))
                .limit(1);
        }

        const sibling = await siblingQuery;
        if (sibling.length === 0) return;

        const siblingId = sibling[0].id;
        const siblingOrder = sibling[0].order;

        // Swap orders
        await drizzleDb.update(schema.taskPerPhase)
            .set({ order: siblingOrder })
            .where(eq(schema.taskPerPhase.id, id));
            
        await drizzleDb.update(schema.taskPerPhase)
            .set({ order: currentOrder })
            .where(eq(schema.taskPerPhase.id, siblingId));
    };

    return {
        queryProjects,
        queryProjectById,
        insertProject,
        updateProject,
        deleteProject,
        queryPhasesByProjectId,
        insertPhase,
        updatePhase,
        deletePhase,
        movePhase,
        queryTasksByPhaseId,
        insertTask,
        updateTask,
        deleteTask,
        moveTask
    };
};
