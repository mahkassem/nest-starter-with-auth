import { HttpStatus } from "@nestjs/common";
import { Expose } from "class-transformer";

export class ActionResponse<T> {
    @Expose() message: string;
    @Expose() data: T | T[] | null | string | number | boolean = null;
    @Expose() statusCode: HttpStatus;

    constructor(data: T, options?: {
        statusCode?: HttpStatus,
        message?: string
    }) {
        this.message = options?.message || 'Success';
        this.data = data;
        this.statusCode = options?.statusCode || HttpStatus.OK;
    }
}