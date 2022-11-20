import { Expose } from "class-transformer";

export class AddressResponse {
    @Expose() id: string;
    @Expose() name: string;
    @Expose() zip_code: string;
    @Expose() address: string;
    @Expose() latitude: number;
    @Expose() longitude: number;
    @Expose() last_used_at: Date;
}