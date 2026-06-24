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
    const progressPercent = project.totalTasks > 0 
        ? Math.round((project.completedTasks / project.totalTasks) * 100)
        : 0;

    return (
        <Pressable 
            onPress={() => onPress(project)} 
            onLongPress={() => onLongPress(project)}
        >
            <Card size="md" variant="outline" className="p-4 rounded-xl mb-3">
                <Box className="flex-row justify-between items-center mb-2">
                    <Heading size="md" className="text-typography-900 font-bold flex-1 pr-2">
                        {project.name}
                    </Heading>
                    <Text size="xs" className="text-typography-400 font-medium">
                        {progressPercent}%
                    </Text>
                </Box>
                {project.description ? (
                    <Text size="sm" className="text-typography-600 line-clamp-3 mb-3">
                        {project.description}
                    </Text>
                ) : null}

                {/* Progress bar */}
                <Box className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    {project.totalTasks > 0 ? (
                        <Box 
                            className="h-full bg-red-600 dark:bg-red-500 rounded-full" 
                            style={{ width: `${progressPercent}%` }} 
                        />
                    ) : null}
                </Box>
            </Card>
        </Pressable>
    );
};
