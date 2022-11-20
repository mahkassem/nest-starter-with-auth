import { Expose } from "class-transformer";

export class UserResponse {
    @Expose() id: string;
    @Expose() email: string;
    @Expose() phone: string;
    @Expose() username: string;
    @Expose() avatar: string;
    @Expose() created_at: Date;
}