import { JsonObject } from 'frontend/types/common-types';

export class Task {
    id: string;
    accountId: string;
    title: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;

    constructor(json: JsonObject) {
        this.id = json.id as string;
        this.accountId = json.account_id as string;
        this.title = json.title as string;
        this.description = json.description as string;
        this.active = json.active as boolean;
        this.createdAt = json.created_at as string;
        this.updatedAt = json.updated_at as string;
    }
}
