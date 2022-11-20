import { HttpStatus } from "@nestjs/common";
import { Expose } from "class-transformer";

export class ActionResponse<T> {
    @Expose() message: string;
    @Expose() data: T | T[] | null | string | number | boolean = null;
    @Expose() statusCode: HttpStatus;

    constructor(data: string | number | boolean | T | T[], options?: {
        statusCode?: HttpStatus,
        message?: string,
        meta?: { page: number, limit: number, total: number }
    }) {
        this.message = options?.message || 'Success';
        this.data = data;
        this.statusCode = options?.statusCode || HttpStatus.OK;
    }
}