import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button, H2, VerticalStackLayout, ParagraphMedium } from 'frontend/components';
import routes from 'frontend/constants/routes';
import { useAccountContext } from 'frontend/contexts';
import TaskService from 'frontend/services/task.service';
import CommentService from 'frontend/services/comment.service';
import { Task } from 'frontend/types/task';
import { Comment } from 'frontend/types/comment';
import TaskForm from 'frontend/components/tasks/task-form';
import CommentList from 'frontend/components/comments/comment-list';
import CommentForm from 'frontend/components/comments/comment-form';

const TaskDetailsPage: React.FC = () => {
    const { account } = useAccountContext();
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const taskService = new TaskService();
    const commentService = new CommentService();

    const fetchTask = async () => {
        if (!account || !taskId) return;
        try {
            const taskData = await taskService.getTask(account.id, taskId);
            setTask(taskData);
        } catch {
            toast.error('Failed to load task');
            navigate(routes.TASKS);
        }
    };

    const fetchComments = async () => {
        if (!account || !taskId) return;
        try {
            const commentsData = await commentService.getComments(account.id, taskId);
            setComments(commentsData);
        } catch {
            toast.error('Failed to load comments');
        }
    };

    useEffect(() => {
        fetchTask();
        fetchComments();
    }, [account, taskId]);

    const handleUpdateTask = async (title: string, description: string) => {
        if (!account || !taskId) return;
        try {
            await taskService.updateTask(account.id, taskId, title, description);
            toast.success('Task updated');
            setIsEditingTask(false);
            fetchTask();
        } catch {
            toast.error('Failed to update task');
        }
    };

    const handleDeleteTask = async () => {
        if (!account || !taskId) return;
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskService.deleteTask(account.id, taskId);
            toast.success('Task deleted');
            navigate(routes.TASKS);
        } catch {
            toast.error('Failed to delete task');
        }
    };

    const handleAddComment = async (content: string) => {
        if (!account || !taskId) return;
        try {
            await commentService.createComment(account.id, taskId, content);
            toast.success('Comment added');
            fetchComments();
        } catch {
            toast.error('Failed to add comment');
        }
    };

    const handleEditComment = async (commentId: string, content: string) => {
        if (!account) return;
        try {
            await commentService.updateComment(account.id, commentId, content);
            toast.success('Comment updated');
            fetchComments();
        } catch {
            toast.error('Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!account) return;
        if (!window.confirm('Delete comment?')) return;
        try {
            await commentService.deleteComment(account.id, commentId);
            toast.success('Comment deleted');
            fetchComments();
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    if (!task) return <ParagraphMedium>Loading...</ParagraphMedium>;

    return (
        <VerticalStackLayout gap={8}>
            <div>
                <Button variant="secondary" onClick={() => navigate(routes.TASKS)}>
                    &larr; Back to Tasks
                </Button>
            </div>

            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                {isEditingTask ? (
                    <>
                        <H2>Edit Task</H2>
                        <TaskForm
                            initialTitle={task.title}
                            initialDescription={task.description}
                            onSubmit={handleUpdateTask}
                            submitLabel="Save Changes"
                        />
                        <Button variant="secondary" onClick={() => setIsEditingTask(false)} style={{ marginTop: '10px' }}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <H2>{task.title}</H2>
                        <ParagraphMedium>{task.description}</ParagraphMedium>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                            <Button onClick={() => setIsEditingTask(true)}>Edit Task</Button>
                            <Button onClick={handleDeleteTask} style={{ backgroundColor: 'red', borderColor: 'red' }}>Delete Task</Button>
                        </div>
                    </>
                )}
            </div>

            <div>
                <H2>Comments</H2>
                <VerticalStackLayout gap={4}>
                    <CommentForm onSubmit={handleAddComment} />
                    <CommentList
                        comments={comments}
                        onEdit={handleEditComment}
                        onDelete={handleDeleteComment}
                    />
                </VerticalStackLayout>
            </div>
        </VerticalStackLayout>
    );
};

export default TaskDetailsPage;
