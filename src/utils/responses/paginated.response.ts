import { Expose } from "class-transformer";
import { ActionResponse } from "./action.response";

export class PaginatedResponse<T> extends ActionResponse<T> {
    @Expose()
    meta?: {
        currPage: number,
        perPage: number,
        total: number
    };

    constructor(data, options) {
        super(data, options);
        this.meta = options?.meta;
    }
}