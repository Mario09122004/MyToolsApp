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
import { useCRUDProjects, ProjectWithStats } from '../hooks/projects/useCRUDProjects';
import { Phase, TaskPerPhase } from '@/db/schema';

// Components
import { ProjectCard } from '../components/Projects/ProjectCard';
import { ProjectForm } from '../components/Projects/ProjectForm';
import { PhaseItem } from '../components/Projects/PhaseItem';
import { PhaseForm } from '../components/Projects/PhaseForm';
import { TaskForm } from '../components/Projects/TaskForm';

export default function ProjectsScreen() {
    const { changeNameScreen } = name_Screen();
    const {
        queryProjects,
        deleteProject,
        queryPhasesByProjectId,
        updatePhase,
        deletePhase,
        movePhase,
        deleteTask,
    } = useCRUDProjects();

    // Screen Setup
    useEffect(() => {
        changeNameScreen("Projects");
        fetchProjects();
    }, []);

    // State
    const [dataProjects, setDataProjects] = useState<ProjectWithStats[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectWithStats | null>(null);
    const [phases, setPhases] = useState<Phase[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshTasksTrigger, setRefreshTasksTrigger] = useState(0);

    // Modal & Dialog state
    // -- Projects
    const [projectModalVisible, setProjectModalVisible] = useState(false);
    const [projectEditMode, setProjectEditMode] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<ProjectWithStats | null>(null);
    const [deleteProjectConfirmVisible, setDeleteProjectConfirmVisible] = useState(false);

    // -- Phases
    const [phaseModalVisible, setPhaseModalVisible] = useState(false);
    const [phaseEditMode, setPhaseEditMode] = useState(false);
    const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
    const [phaseToDelete, setPhaseToDelete] = useState<Phase | null>(null);
    const [deletePhaseConfirmVisible, setDeletePhaseConfirmVisible] = useState(false);

    // -- Tasks
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [taskEditMode, setTaskEditMode] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskPerPhase | null>(null);
    const [activePhaseId, setActivePhaseId] = useState<number | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<TaskPerPhase | null>(null);
    const [deleteTaskConfirmVisible, setDeleteTaskConfirmVisible] = useState(false);

    // Fetch Projects from DB
    const fetchProjects = async () => {
        try {
            const list = await queryProjects();
            setDataProjects(list);

            // Refresh current selected project stats if viewing details
            if (selectedProject) {
                const updated = list.find(p => p.id === selectedProject.id);
                if (updated) {
                    setSelectedProject(updated);
                } else {
                    setSelectedProject(null);
                }
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    // Fetch Phases for Selected Project
    const fetchPhases = async (projectId: number) => {
        try {
            const list = await queryPhasesByProjectId(projectId);
            setPhases(list);
        } catch (error) {
            console.error("Error fetching phases:", error);
        }
    };

    useEffect(() => {
        if (selectedProject) {
            fetchPhases(selectedProject.id);
        } else {
            setPhases([]);
        }
    }, [selectedProject]);

    // Handle project click
    const handleProjectClick = (project: ProjectWithStats) => {
        setSelectedProject(project);
    };

    const handleProjectLongPress = (project: ProjectWithStats) => {
        setProjectToDelete(project);
        setDeleteProjectConfirmVisible(true);
    };

    const handleConfirmDeleteProject = async () => {
        if (projectToDelete) {
            try {
                await deleteProject(projectToDelete.id);
                if (selectedProject?.id === projectToDelete.id) {
                    setSelectedProject(null);
                }
                await fetchProjects();
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
        setDeleteProjectConfirmVisible(false);
        setProjectToDelete(null);
    };

    // Handle Phases actions
    const handleTogglePhaseComplete = async (phase: Phase) => {
        try {
            await updatePhase(phase.id, phase.name, phase.description, !phase.completed, phase.dueday);
            if (selectedProject) {
                await fetchPhases(selectedProject.id);
            }
            await fetchProjects();
        } catch (error) {
            console.error("Error toggling phase:", error);
        }
    };

    const handleMovePhase = async (phase: Phase, direction: 'up' | 'down') => {
        try {
            await movePhase(phase.id, direction);
            if (selectedProject) {
                await fetchPhases(selectedProject.id);
            }
        } catch (error) {
            console.error("Error moving phase:", error);
        }
    };

    const handleConfirmDeletePhase = async () => {
        if (phaseToDelete) {
            try {
                await deletePhase(phaseToDelete.id);
                if (selectedProject) {
                    await fetchPhases(selectedProject.id);
                }
                await fetchProjects();
            } catch (error) {
                console.error("Error deleting phase:", error);
            }
        }
        setDeletePhaseConfirmVisible(false);
        setPhaseToDelete(null);
    };

    // Handle Tasks actions
    const handleConfirmDeleteTask = async () => {
        if (taskToDelete) {
            try {
                await deleteTask(taskToDelete.id);
                setRefreshTasksTrigger(prev => prev + 1); // trigger reload tasks in all PhaseItems
                await fetchProjects(); // refresh completed/total tasks count
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
        setDeleteTaskConfirmVisible(false);
        setTaskToDelete(null);
    };

    // Search and totals calculations
    const filteredProjects = dataProjects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalGlobalTasks = dataProjects.reduce((sum, p) => sum + p.totalTasks, 0);
    const completedGlobalTasks = dataProjects.reduce((sum, p) => sum + p.completedTasks, 0);
    const globalProgressPercent = totalGlobalTasks > 0
        ? Math.round((completedGlobalTasks / totalGlobalTasks) * 100)
        : 0;

    return (
        <Box className="flex-1 bg-neutral-50 dark:bg-neutral-950">
            {selectedProject === null ? (
                // MASTER VIEW
                <>
                    {/* Search Field */}
                    <Box className="px-4 mb-3">
                        <Input className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" size="md">
                            <InputField
                                type="text"
                                placeholder="Search project..."
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

                    {/* Projects list */}
                    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                        <Box className="pb-24">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onPress={handleProjectClick}
                                        onLongPress={handleProjectLongPress}
                                    />
                                ))
                            ) : (
                                <Box className="items-center justify-center py-20">
                                    <Box className="w-full py-20 items-center justify-center bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl p-6">
                                        <Box className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center mb-3">
                                            <Icon as={InfoIcon} size="xl" className="text-red-600 dark:text-red-500" />
                                        </Box>
                                        <Text className="text-typography-500 font-semibold text-center text-base">
                                            {searchQuery ? 'No matching projects' : 'No projects created yet'}
                                        </Text>
                                        <Text className="text-typography-400 text-center mt-1 text-sm px-4">
                                            {searchQuery
                                                ? 'Try typing a different name.'
                                                : 'Press the "Create" button below to add your first project.'}
                                        </Text>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </ScrollView>

                    {/* Create Project FAB */}
                    <Fab
                        size="lg"
                        placement="bottom right"
                        onPress={() => {
                            setProjectEditMode(false);
                            setProjectModalVisible(true);
                        }}
                        className="absolute bottom-6 right-4 bg-red-600 hover:bg-red-700 active:bg-red-800 border-none rounded-full"
                    >
                        <FabIcon as={AddIcon} />
                        <FabLabel>Create</FabLabel>
                    </Fab>
                </>
            ) : (
                // DETAIL VIEW
                <>
                    {/* Back Header Navigation Bar */}
                    <Box className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        <Box className="flex-row items-center flex-1 mr-2">
                            <TouchableOpacity onPress={() => setSelectedProject(null)} className="p-2 -ml-2 mr-1">
                                <Icon as={ArrowLeftIcon} size="xl" className="text-neutral-800 dark:text-neutral-200" />
                            </TouchableOpacity>
                            <Box className="flex-1">
                                <Heading size="md" className="text-typography-900 font-bold" numberOfLines={1}>
                                    {selectedProject.name}
                                </Heading>
                            </Box>
                        </Box>
                        <Box className="flex-row items-center gap-1.5">
                            <TouchableOpacity
                                onPress={() => {
                                    setProjectEditMode(true);
                                    setProjectModalVisible(true);
                                }}
                                className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full"
                            >
                                <Icon as={EditIcon} size="sm" className="text-neutral-600 dark:text-neutral-300" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setProjectToDelete(selectedProject);
                                    setDeleteProjectConfirmVisible(true);
                                }}
                                className="p-2.5 bg-red-50 dark:bg-red-950/20 rounded-full"
                            >
                                <Icon as={TrashIcon} size="sm" className="text-red-600 dark:text-red-400" />
                            </TouchableOpacity>
                        </Box>
                    </Box>

                    <ScrollView className="flex-1 px-4 mt-3" showsVerticalScrollIndicator={false}>
                        {selectedProject.description ? (
                            <Box className="mb-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
                                <Text size="xs" className="text-typography-400 font-bold uppercase tracking-wider mb-1">Description</Text>
                                <Text size="sm" className="text-typography-700">
                                    {selectedProject.description}
                                </Text>
                            </Box>
                        ) : null}

                        {/* Project Statistics Card */}
                        <Card size="md" variant="filled" className="mb-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
                            <Box className="flex-row justify-between items-center mb-2">
                                <Box>
                                    <Text size="xs" className="text-typography-400 font-bold uppercase tracking-wider">Project Progress</Text>
                                    <Heading size="xl" className="text-typography-900 font-extrabold mt-1">
                                        {selectedProject.totalTasks > 0
                                            ? `${Math.round((selectedProject.completedTasks / selectedProject.totalTasks) * 100)}%`
                                            : 'No tasks'}
                                    </Heading>
                                    <Text size="xs" className="text-typography-500 mt-0.5">
                                        {selectedProject.completedTasks} / {selectedProject.totalTasks} tasks completed
                                    </Text>
                                </Box>
                                <Box className="items-end">
                                    <Text size="xs" className="text-typography-400 font-bold uppercase tracking-wider">Created</Text>
                                    <Heading size="sm" className="text-typography-900 font-extrabold mt-1">
                                        {new Date(selectedProject.dueday).toLocaleDateString()}
                                    </Heading>
                                </Box>
                            </Box>
                            <Box className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mt-1">
                                {selectedProject.totalTasks > 0 ? (
                                    <Box
                                        className="h-full bg-red-600 dark:bg-red-500 rounded-full"
                                        style={{ width: `${(selectedProject.completedTasks / selectedProject.totalTasks) * 100}%` }}
                                    />
                                ) : null}
                            </Box>
                        </Card>

                        {/* Phase Section Heading */}
                        <Box className="mb-3 px-1">
                            <Heading size="xs" className="text-typography-400 font-bold uppercase tracking-wider">
                                Project Phases
                            </Heading>
                        </Box>

                        {/* Phases List */}
                        <Box className="pb-24">
                            {phases.length > 0 ? (
                                phases.map((phase) => (
                                    <PhaseItem
                                        key={phase.id}
                                        phase={phase}
                                        onToggleComplete={handleTogglePhaseComplete}
                                        onEditPhase={(p) => {
                                            setSelectedPhase(p);
                                            setPhaseEditMode(true);
                                            setPhaseModalVisible(true);
                                        }}
                                        onDeletePhase={(p) => {
                                            setPhaseToDelete(p);
                                            setDeletePhaseConfirmVisible(true);
                                        }}
                                        onMovePhase={handleMovePhase}
                                        onAddTaskClick={(phaseId) => {
                                            setActivePhaseId(phaseId);
                                            setTaskEditMode(false);
                                            setTaskModalVisible(true);
                                        }}
                                        onEditTaskClick={(task) => {
                                            setSelectedTask(task);
                                            setActivePhaseId(task.phaseId);
                                            setTaskEditMode(true);
                                            setTaskModalVisible(true);
                                        }}
                                        onDeleteTaskClick={(task) => {
                                            setTaskToDelete(task);
                                            setDeleteTaskConfirmVisible(true);
                                        }}
                                        onTasksUpdated={fetchProjects}
                                        refreshTrigger={refreshTasksTrigger}
                                    />
                                ))
                            ) : (
                                <Box className="items-center justify-center py-10 bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                                    <Text className="text-typography-400 text-center font-medium">
                                        No phases created for this project yet.
                                    </Text>
                                    <Text className="text-typography-300 text-center text-xs mt-1">
                                        Press the "+ Phase" button below to start mapping your process.
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </ScrollView>

                    {/* Create Phase FAB */}
                    <Fab
                        size="lg"
                        placement="bottom right"
                        onPress={() => {
                            setPhaseEditMode(false);
                            setPhaseModalVisible(true);
                        }}
                        className="absolute bottom-6 right-4 bg-red-600 hover:bg-red-700 active:bg-red-800 border-none rounded-full"
                    >
                        <FabIcon as={AddIcon} />
                        <FabLabel>Phase</FabLabel>
                    </Fab>
                </>
            )}

            {/* MODALS & ALERT DIALOGS */}

            {/* Project Modal */}
            <Modal
                isOpen={projectModalVisible}
                onClose={() => setProjectModalVisible(false)}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="border-b pb-3 relative">
                        <Heading size="lg" className="text-typography-900 font-bold">
                            {projectEditMode ? "Rename/Edit Project" : "Create Project"}
                        </Heading>
                        <ModalCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="py-4">
                        <ProjectForm
                            editMode={projectEditMode}
                            projectId={selectedProject?.id}
                            initialValues={
                                projectEditMode && selectedProject
                                    ? {
                                          name: selectedProject.name,
                                          description: selectedProject.description || '',
                                          dueday: selectedProject.dueday,
                                      }
                                    : undefined
                            }
                            onSave={fetchProjects}
                            onClose={() => setProjectModalVisible(false)}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Phase Modal */}
            <Modal
                isOpen={phaseModalVisible}
                onClose={() => setPhaseModalVisible(false)}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="border-b pb-3 relative">
                        <Heading size="lg" className="text-typography-900 font-bold">
                            {phaseEditMode ? "Edit Phase" : "Add Phase"}
                        </Heading>
                        <ModalCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="py-4">
                        {selectedProject && (
                            <PhaseForm
                                editMode={phaseEditMode}
                                projectId={selectedProject.id}
                                phaseId={selectedPhase?.id}
                                initialValues={
                                    phaseEditMode && selectedPhase
                                        ? {
                                              name: selectedPhase.name,
                                              description: selectedPhase.description || '',
                                              dueday: selectedPhase.dueday,
                                          }
                                        : undefined
                                }
                                onSave={() => fetchPhases(selectedProject.id)}
                                onClose={() => setPhaseModalVisible(false)}
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Task Modal */}
            <Modal
                isOpen={taskModalVisible}
                onClose={() => setTaskModalVisible(false)}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="border-b pb-3 relative">
                        <Heading size="lg" className="text-typography-900 font-bold">
                            {taskEditMode ? "Edit Task" : "Add Task"}
                        </Heading>
                        <ModalCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="py-4">
                        {activePhaseId !== null && (
                            <TaskForm
                                editMode={taskEditMode}
                                phaseId={activePhaseId}
                                taskId={selectedTask?.id}
                                initialValues={
                                    taskEditMode && selectedTask
                                        ? {
                                              taskName: selectedTask.taskName,
                                              description: selectedTask.description || '',
                                              dueday: selectedTask.dueday,
                                          }
                                        : undefined
                                }
                                onSave={async () => {
                                    setRefreshTasksTrigger(prev => prev + 1);
                                    await fetchProjects();
                                }}
                                onClose={() => setTaskModalVisible(false)}
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Project Alert */}
            <AlertDialog isOpen={deleteProjectConfirmVisible} onClose={() => setDeleteProjectConfirmVisible(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md" className="text-typography-900 font-bold">Delete Project?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center text-typography-600">
                            This will permanently delete "{projectToDelete?.name}" and all of its phases and tasks. This action cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5 gap-3 w-full flex-row justify-center">
                        <Button
                            size="sm"
                            onPress={handleConfirmDeleteProject}
                            className="px-[30px] bg-red-600 active:bg-red-700 hover:bg-red-700 border-none"
                        >
                            <ButtonText className="font-bold text-white">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={() => setDeleteProjectConfirmVisible(false)}
                            size="sm"
                            className="px-[30px] border-neutral-300 dark:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900"
                        >
                            <ButtonText className="font-bold text-typography-700">Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Phase Alert */}
            <AlertDialog isOpen={deletePhaseConfirmVisible} onClose={() => setDeletePhaseConfirmVisible(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md" className="text-typography-900 font-bold">Delete Phase?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center text-typography-600">
                            This will permanently delete the phase "{phaseToDelete?.name}" and all of its tasks. This action cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5 gap-3 w-full flex-row justify-center">
                        <Button
                            size="sm"
                            onPress={handleConfirmDeletePhase}
                            className="px-[30px] bg-red-600 active:bg-red-700 hover:bg-red-700 border-none"
                        >
                            <ButtonText className="font-bold text-white">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={() => setDeletePhaseConfirmVisible(false)}
                            size="sm"
                            className="px-[30px] border-neutral-300 dark:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900"
                        >
                            <ButtonText className="font-bold text-typography-700">Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Task Alert */}
            <AlertDialog isOpen={deleteTaskConfirmVisible} onClose={() => setDeleteTaskConfirmVisible(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md" className="text-typography-900 font-bold">Delete Task?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center text-typography-600">
                            This task will be permanently deleted from the phase. This action cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5 gap-3 w-full flex-row justify-center">
                        <Button
                            size="sm"
                            onPress={handleConfirmDeleteTask}
                            className="px-[30px] bg-red-600 active:bg-red-700 hover:bg-red-700 border-none"
                        >
                            <ButtonText className="font-bold text-white">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={() => setDeleteTaskConfirmVisible(false)}
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