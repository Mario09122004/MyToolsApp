import React from 'react';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable } from 'react-native';
import { ProjectWithStats } from '@/src/hooks/projects/useCRUDProjects';

interface ProjectCardProps {
    project: ProjectWithStats;
    onPress: (project: ProjectWithStats) => void;
    onLongPress: (project: ProjectWithStats) => void;
}

export const ProjectCard = ({ project, onPress, onLongPress }: ProjectCardProps) => {
    const getRemainingTime = (dueday: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const due = new Date(dueday);
        due.setHours(0, 0, 0, 0);
        
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            const absDays = Math.abs(diffDays);
            return {
                text: `Overdue by ${absDays} ${absDays === 1 ? 'day' : 'days'}`,
                colorClass: 'text-red-600 dark:text-red-500 font-bold',
                bgColor: 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
            };
        } else if (diffDays === 0) {
            return {
                text: 'Due today',
                colorClass: 'text-amber-600 dark:text-amber-500 font-bold',
                bgColor: 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
            };
        } else {
            return {
                text: `Due in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`,
                colorClass: 'text-neutral-600 dark:text-neutral-400 font-semibold',
                bgColor: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
            };
        }
    };

    const timeInfo = getRemainingTime(project.dueday);
    const progressPercent = project.totalTasks > 0 
        ? Math.round((project.completedTasks / project.totalTasks) * 100)
        : 0;

    return (
        <Pressable 
            onPress={() => onPress(project)} 
            onLongPress={() => onLongPress(project)}
        >
            <Card size="md" variant="outline" className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-4">
                <Box className="flex-row justify-between items-start gap-2 mb-2">
                    <Heading size="md" className="text-typography-900 font-bold flex-1">
                        {project.name}
                    </Heading>
                    <Box className={`px-2.5 py-0.5 rounded-full border ${timeInfo.bgColor}`}>
                        <Text size="xs" className={timeInfo.colorClass}>
                            {timeInfo.text}
                        </Text>
                    </Box>
                </Box>

                {project.description ? (
                    <Text size="sm" className="text-typography-500 mb-4 line-clamp-2">
                        {project.description}
                    </Text>
                ) : null}

                {/* Progress bar container */}
                <Box className="mt-2">
                    <Box className="flex-row justify-between items-center mb-1">
                        <Text size="xs" className="text-typography-400 font-medium uppercase tracking-wider">
                            Progress
                        </Text>
                        <Text size="xs" className="text-typography-600 font-bold">
                            {project.totalTasks > 0 
                                ? `${progressPercent}% (${project.completedTasks}/${project.totalTasks} tasks)` 
                                : 'No tasks'}
                        </Text>
                    </Box>
                    <Box className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        {project.totalTasks > 0 ? (
                            <Box 
                                className="h-full bg-red-600 dark:bg-red-500 rounded-full" 
                                style={{ width: `${progressPercent}%` }} 
                            />
                        ) : null}
                    </Box>
                </Box>
            </Card>
        </Pressable>
    );
};
