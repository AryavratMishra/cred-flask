import APIService from 'frontend/services/api.service';
import { Comment } from 'frontend/types/comment';
import { JsonObject } from 'frontend/types/common-types';

export default class CommentService extends APIService {
    getComments = async (accountId: string, taskId: string): Promise<Comment[]> => {
        const response = await this.apiClient.get<JsonObject[]>(
            `/accounts/${accountId}/tasks/${taskId}/comments`,
        );
        return response.data.map((c) => new Comment(c));
    };

    createComment = async (
        accountId: string,
        taskId: string,
        content: string,
    ): Promise<Comment> => {
        const response = await this.apiClient.post<JsonObject>(
            `/accounts/${accountId}/tasks/${taskId}/comments`,
            { content },
        );
        return new Comment(response.data);
    };

    updateComment = async (
        accountId: string,
        commentId: string,
        content: string,
    ): Promise<Comment> => {
        const response = await this.apiClient.patch<JsonObject>(
            `/accounts/${accountId}/comments/${commentId}`,
            { content },
        );
        return new Comment(response.data);
    };

    deleteComment = async (accountId: string, commentId: string): Promise<void> => {
        await this.apiClient.delete(`/accounts/${accountId}/comments/${commentId}`);
    };
}
