import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendOtpRequest {
    @ApiProperty()
    @IsOptional() @IsString()
    type: "phone" | "email";

    @ApiProperty()
    @IsNotEmpty() @IsString()
    username: string;
}