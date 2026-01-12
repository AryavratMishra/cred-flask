import React, { useState } from 'react';
import { Button, FormControl, Input, VerticalStackLayout } from 'frontend/components';

interface TaskFormProps {
    initialTitle?: string;
    initialDescription?: string;
    onSubmit: (title: string, description: string) => Promise<void>;
    submitLabel?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
    initialTitle = '',
    initialDescription = '',
    onSubmit,
    submitLabel = 'Save Task',
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) return;

        setIsLoading(true);
        try {
            await onSubmit(title, description);
            // Reset if adding new? No, leave control to parent
            if (!initialTitle) {
                setTitle('');
                setDescription('');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VerticalStackLayout gap={4}>
                <FormControl label="Title">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        required
                    />
                </FormControl>
                <FormControl label="Description">
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                        required
                    />
                </FormControl>
                <Button type="submit" isLoading={isLoading}>
                    {submitLabel}
                </Button>
            </VerticalStackLayout>
        </form>
    );
};

export default TaskForm;
