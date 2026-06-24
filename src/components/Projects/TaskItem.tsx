import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Icon, TrashIcon, EditIcon, ArrowUpIcon, ArrowDownIcon } from '@/components/ui/icon';
import { Pressable, TouchableOpacity } from 'react-native';
import { TaskPerPhase } from '@/db/schema';

// We can define custom check icons or use Unicode/Lucide icons if needed.
// Standard Gluestack has CheckCircleIcon or CircleIcon
import { CheckCircleIcon, CircleIcon } from '@/components/ui/icon';

interface TaskItemProps {
    task: TaskPerPhase;
    onToggleComplete: (task: TaskPerPhase) => void;
    onEdit: (task: TaskPerPhase) => void;
    onDelete: (task: TaskPerPhase) => void;
    onMove: (task: TaskPerPhase, direction: 'up' | 'down') => void;
}

export const TaskItem = ({
    task,
    onToggleComplete,
    onEdit,
    onDelete,
    onMove,
}: TaskItemProps) => {
    const formattedDate = new Date(task.dueday).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
    });

    const isOverdue = task.dueday < Date.now() && !task.completed;

    return (
        <Box className={`flex-row items-center justify-between p-3 rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 mb-2 gap-2`}>
            {/* Checkbox & Details */}
            <Box className="flex-row items-center flex-1 gap-2.5">
                <TouchableOpacity onPress={() => onToggleComplete(task)} className="p-1">
                    <Icon
                        as={task.completed ? CheckCircleIcon : CircleIcon}
                        size="md"
                        className={task.completed ? "text-green-600 dark:text-green-500" : "text-neutral-400 dark:text-neutral-600"}
                    />
                </TouchableOpacity>

                <Box className="flex-1">
                    <Text
                        size="sm"
                        className={`font-semibold text-typography-900 ${
                            task.completed ? 'line-through text-typography-400 dark:text-typography-600' : ''
                        }`}
                    >
                        {task.taskName}
                    </Text>
                    {task.description ? (
                        <Text
                            size="xs"
                            className={`text-typography-500 ${
                                task.completed ? 'line-through text-typography-300 dark:text-typography-700' : ''
                            }`}
                        >
                            {task.description}
                        </Text>
                    ) : null}
                    
                    {/* Due Date */}
                    <Text
                        size="2xs"
                        className={`font-medium mt-0.5 ${
                            isOverdue
                                ? 'text-red-500 font-bold'
                                : 'text-typography-400'
                        }`}
                    >
                        Due: {formattedDate} {isOverdue ? '(Overdue)' : ''}
                    </Text>
                </Box>
            </Box>

            {/* Reorder and Action Controls */}
            <Box className="flex-row items-center gap-1.5">
                {/* Reorder buttons */}
                <TouchableOpacity onPress={() => onMove(task, 'up')} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                    <Icon as={ArrowUpIcon} size="xs" className="text-neutral-500 dark:text-neutral-400" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onMove(task, 'down')} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                    <Icon as={ArrowDownIcon} size="xs" className="text-neutral-500 dark:text-neutral-400" />
                </TouchableOpacity>

                {/* Edit & Delete */}
                <TouchableOpacity onPress={() => onEdit(task)} className="p-1.5 bg-neutral-150 dark:bg-neutral-800 rounded">
                    <Icon as={EditIcon} size="xs" className="text-neutral-600 dark:text-neutral-300" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(task)} className="p-1.5 bg-red-50 dark:bg-red-950/20 rounded">
                    <Icon as={TrashIcon} size="xs" className="text-red-600 dark:text-red-400" />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};
