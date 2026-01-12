import React, { useState } from 'react';
import { Button, ParagraphMedium, VerticalStackLayout } from 'frontend/components';
import { Comment } from 'frontend/types/comment';
import CommentForm from './comment-form';

interface CommentListProps {
    comments: Comment[];
    onEdit: (commentId: string, content: string) => Promise<void>;
    onDelete: (commentId: string) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onEdit, onDelete }) => {
    const [editingId, setEditingId] = useState<string | null>(null);

    if (comments.length === 0) {
        return <ParagraphMedium>No comments yet.</ParagraphMedium>;
    }

    return (
        <VerticalStackLayout gap={3}>
            {comments.map((comment) => (
                <div key={comment.id} style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                    {editingId === comment.id ? (
                        <CommentForm
                            initialContent={comment.content}
                            onSubmit={async (content) => {
                                await onEdit(comment.id, content);
                                setEditingId(null);
                            }}
                            submitLabel="Save"
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <>
                            <ParagraphMedium>{comment.content}</ParagraphMedium>
                            <div style={{ fontSize: '0.8em', color: '#888', marginTop: '5px' }}>
                                {new Date(comment.createdAt).toLocaleString()}
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <button
                                    onClick={() => setEditingId(comment.id)}
                                    style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(comment.id)}
                                    style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </VerticalStackLayout>
    );
};

export default CommentList;
