import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateAddressRequest } from "./create-address.request";

export class UpdateAddressRequest extends CreateAddressRequest {
    @ApiProperty()
    @IsNotEmpty() @IsString()
    id: string;
}