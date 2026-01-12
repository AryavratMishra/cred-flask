import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button, H2, VerticalStackLayout, ParagraphMedium } from 'frontend/components';
import routes from 'frontend/constants/routes';
import { useAccountContext } from 'frontend/contexts';
import TaskService from 'frontend/services/task.service';
import { Task } from 'frontend/types/task';
import TaskForm from 'frontend/components/tasks/task-form';

const TasksPage: React.FC = () => {
    const { account } = useAccountContext();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const taskService = new TaskService();

    const fetchTasks = async () => {
        if (!account) return;
        setIsLoading(true);
        try {
            const response = await taskService.getTasks(account.id);
            setTasks(response.data); // Assuming data is the array
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [account]);

    const handleCreateTask = async (title: string, description: string) => {
        if (!account) return;
        try {
            await taskService.createTask(account.id, title, description);
            toast.success('Task created');
            fetchTasks();
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    return (
        <VerticalStackLayout gap={8}>
            <H2>My Tasks</H2>

            <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
                <ParagraphMedium>Create New Task</ParagraphMedium>
                <TaskForm onSubmit={handleCreateTask} submitLabel="Add Task" />
            </div>

            <VerticalStackLayout gap={4}>
                {isLoading && <ParagraphMedium>Loading tasks...</ParagraphMedium>}
                {!isLoading && tasks.length === 0 && <ParagraphMedium>No tasks found.</ParagraphMedium>}
                {tasks.map((task) => (
                    <div key={task.id} style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <Link to={routes.TASK_DETAILS.replace(':taskId', task.id)} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                            <div style={{ color: '#666' }}>{task.description}</div>
                        </Link>
                    </div>
                ))}
            </VerticalStackLayout>
        </VerticalStackLayout>
    );
};

export default TasksPage;
