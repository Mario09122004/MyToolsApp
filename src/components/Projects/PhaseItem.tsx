import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import {
    Icon,
    ChevronDownIcon,
    ChevronUpIcon,
    TrashIcon,
    EditIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    CheckCircleIcon,
    CircleIcon,
    AddIcon
} from '@/components/ui/icon';
import { Pressable, TouchableOpacity } from 'react-native';
import { Phase, TaskPerPhase } from '@/db/schema';
import { useCRUDProjects } from '@/src/hooks/projects/useCRUDProjects';
import { TaskItem } from './TaskItem';

interface PhaseItemProps {
    phase: Phase;
    onToggleComplete: (phase: Phase) => void;
    onEditPhase: (phase: Phase) => void;
    onDeletePhase: (phase: Phase) => void;
    onMovePhase: (phase: Phase, direction: 'up' | 'down') => void;
    onAddTaskClick: (phaseId: number) => void;
    onEditTaskClick: (task: TaskPerPhase) => void;
    onDeleteTaskClick: (task: TaskPerPhase) => void;
    onTasksUpdated: () => void;
    refreshTrigger: number; // Increment this to force reload tasks from parent
}

export const PhaseItem = ({
    phase,
    onToggleComplete,
    onEditPhase,
    onDeletePhase,
    onMovePhase,
    onAddTaskClick,
    onEditTaskClick,
    onDeleteTaskClick,
    onTasksUpdated,
    refreshTrigger,
}: PhaseItemProps) => {
    const { queryTasksByPhaseId, updateTask, moveTask } = useCRUDProjects();
    const [expanded, setExpanded] = useState(false);
    const [tasks, setTasks] = useState<TaskPerPhase[]>([]);

    const fetchTasks = async () => {
        try {
            const list = await queryTasksByPhaseId(phase.id);
            setTasks(list);
        } catch (error) {
            console.error("Error fetching tasks for phase:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [phase.id, refreshTrigger]);

    const handleToggleTask = async (task: TaskPerPhase) => {
        try {
            await updateTask(task.id, task.taskName, task.description, !task.completed, task.dueday);
            await fetchTasks();
            onTasksUpdated(); // Tell parent to update overall progress
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const handleMoveTask = async (task: TaskPerPhase, direction: 'up' | 'down') => {
        try {
            await moveTask(task.id, direction);
            await fetchTasks();
        } catch (error) {
            console.error("Error moving task:", error);
        }
    };

    const completedTasksCount = tasks.filter(t => t.completed).length;
    const totalTasksCount = tasks.length;

    return (
        <Card size="md" variant="outline" className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-3">
            {/* Header / Click to Toggle Expand */}
            <Pressable onPress={() => setExpanded(!expanded)}>
                <Box className="flex-row items-center justify-between gap-2">
                    
                    {/* Checkbox and Title */}
                    <Box className="flex-row items-center flex-1 gap-2.5">
                        <TouchableOpacity onPress={() => onToggleComplete(phase)} className="p-1">
                            <Icon
                                as={phase.completed ? CheckCircleIcon : CircleIcon}
                                size="lg"
                                className={phase.completed ? "text-green-600 dark:text-green-500" : "text-neutral-400 dark:text-neutral-600"}
                            />
                        </TouchableOpacity>

                        <Box className="flex-1">
                            <Heading
                                size="sm"
                                className={`text-typography-900 font-bold ${
                                    phase.completed ? 'line-through text-typography-400 dark:text-typography-600' : ''
                                }`}
                            >
                                {phase.name}
                            </Heading>
                            {phase.description ? (
                                <Text
                                    size="xs"
                                    className={`text-typography-500 mt-0.5 line-clamp-1 ${
                                        phase.completed ? 'line-through text-typography-300 dark:text-typography-700' : ''
                                    }`}
                                >
                                    {phase.description}
                                </Text>
                            ) : null}
                        </Box>
                    </Box>

                    {/* Controls & Chevron */}
                    <Box className="flex-row items-center gap-1">
                        {/* Reorder Buttons */}
                        <TouchableOpacity onPress={() => onMovePhase(phase, 'up')} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                            <Icon as={ArrowUpIcon} size="xs" className="text-neutral-500 dark:text-neutral-400" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onMovePhase(phase, 'down')} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                            <Icon as={ArrowDownIcon} size="xs" className="text-neutral-500 dark:text-neutral-400" />
                        </TouchableOpacity>

                        {/* Edit & Delete */}
                        <TouchableOpacity onPress={() => onEditPhase(phase)} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                            <Icon as={EditIcon} size="xs" className="text-neutral-600 dark:text-neutral-300" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDeletePhase(phase)} className="p-1.5 bg-red-50 dark:bg-red-950/20 rounded">
                            <Icon as={TrashIcon} size="xs" className="text-red-600 dark:text-red-400" />
                        </TouchableOpacity>

                        {/* Chevron Expand Indicator */}
                        <Box className="p-1 ml-1">
                            <Icon
                                as={expanded ? ChevronUpIcon : ChevronDownIcon}
                                size="md"
                                className="text-neutral-400"
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Task ratio summary */}
                <Box className="flex-row justify-between items-center mt-2.5 pt-2.5 border-t border-dashed border-neutral-150 dark:border-neutral-800">
                    <Text size="xs" className="text-typography-400 font-medium uppercase tracking-wider">
                        Tasks
                    </Text>
                    <Text size="xs" className="text-typography-600 font-bold">
                        {completedTasksCount}/{totalTasksCount} completed
                    </Text>
                </Box>
            </Pressable>

            {/* Collapsible Content */}
            {expanded && (
                <Box className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggleComplete={handleToggleTask}
                                onEdit={onEditTaskClick}
                                onDelete={onDeleteTaskClick}
                                onMove={handleMoveTask}
                            />
                        ))
                    ) : (
                        <Box className="py-4 items-center bg-neutral-50 dark:bg-neutral-900/20 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl mb-3">
                            <Text size="xs" className="text-typography-400">
                                No tasks inside this phase.
                            </Text>
                        </Box>
                    )}

                    <Button
                        size="xs"
                        variant="outline"
                        action="secondary"
                        onPress={() => onAddTaskClick(phase.id)}
                        className="mt-1 border-dashed border-neutral-300 dark:border-neutral-700 bg-transparent flex-row justify-center"
                    >
                        <Icon as={AddIcon} size="xs" className="mr-1 text-typography-600" />
                        <ButtonText size="xs" className="text-typography-700 font-bold">
                            Add Task
                        </ButtonText>
                    </Button>
                </Box>
            )}
        </Card>
    );
};
