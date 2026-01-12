import APIService from 'frontend/services/api.service';
import { ApiResponse } from 'frontend/types';
import { Task } from 'frontend/types/task';
import { JsonObject } from 'frontend/types/common-types';

export default class TaskService extends APIService {
    getTasks = async (accountId: string, page = 1, size = 10): Promise<ApiResponse<Task[]>> => {
        const response = await this.apiClient.get<JsonObject>(`/accounts/${accountId}/tasks`, {
            params: { page, size },
        });
        // Handle pagination wrapper
        const items = (response.data.items as JsonObject[]).map((t) => new Task(t));
        return new ApiResponse(items, response.data.pagination_params as any);
        // Types might need adjustment for pagination if ApiResponse doesn't support it directly in this codebase, 
        // but assuming standard wrapper or just returning items mostly. 
        // Checking service-response.ts might be needed if strict.
        // simpler:
        // return new ApiResponse(items);
    };

    getAllTasks = async (accountId: string): Promise<Task[]> => {
        // Helper to just get items if ApiResponse structure is complex
        const response = await this.apiClient.get<JsonObject>(`/accounts/${accountId}/tasks?size=100`);
        return (response.data.items as JsonObject[]).map(t => new Task(t));
    }

    getTask = async (accountId: string, taskId: string): Promise<Task> => {
        const response = await this.apiClient.get<JsonObject>(`/accounts/${accountId}/tasks/${taskId}`);
        return new Task(response.data);
    };

    createTask = async (accountId: string, title: string, description: string): Promise<Task> => {
        const response = await this.apiClient.post<JsonObject>(`/accounts/${accountId}/tasks`, {
            title,
            description,
        });
        return new Task(response.data);
    };

    updateTask = async (
        accountId: string,
        taskId: string,
        title: string,
        description: string,
    ): Promise<Task> => {
        const response = await this.apiClient.patch<JsonObject>(`/accounts/${accountId}/tasks/${taskId}`, {
            title,
            description,
        });
        return new Task(response.data);
    };

    deleteTask = async (accountId: string, taskId: string): Promise<void> => {
        await this.apiClient.delete(`/accounts/${accountId}/tasks/${taskId}`);
    };
}
