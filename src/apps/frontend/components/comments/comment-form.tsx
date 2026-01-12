import React, { useState } from 'react';
import { Button, FormControl, Input, VerticalStackLayout } from 'frontend/components';

interface CommentFormProps {
    initialContent?: string;
    onSubmit: (content: string) => Promise<void>;
    submitLabel?: string;
    onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
    initialContent = '',
    onSubmit,
    submitLabel = 'Add Comment',
    onCancel,
}) => {
    const [content, setContent] = useState(initialContent);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;

        setIsLoading(true);
        try {
            await onSubmit(content);
            if (!initialContent) {
                setContent('');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VerticalStackLayout gap={2}>
                <FormControl>
                    <Input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a comment..."
                        required
                    />
                </FormControl>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="submit" isLoading={isLoading}>
                        {submitLabel}
                    </Button>
                    {onCancel && (
                        <Button type="button" onClick={onCancel} variant="secondary">
                            {/* Assuming variant exists or styles fallback */}
                            Cancel
                        </Button>
                    )}
                </div>
            </VerticalStackLayout>
        </form>
    );
};

export default CommentForm;
