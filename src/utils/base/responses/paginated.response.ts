import { Expose } from "class-transformer";
import { ActionResponse } from "./action.response";

export class PaginatedResponse<T> extends ActionResponse<T> {
    @Expose()
    meta?: {
        page: number,
        limit: number,
        total: number
    };

    constructor(data: T | T[], options: {
        statusCode?: number,
        message?: string,
        meta?: { page: number, limit: number, total: number }
    }) {
        super(data, options);
        this.meta = {
            page: parseInt(options.meta?.page as any),
            limit: parseInt(options.meta?.limit as any),
            total: parseInt(options.meta?.total as any)
        };
    }
}