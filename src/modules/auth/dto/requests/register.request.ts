import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { UniqueEmail } from "src/utils/validations/unique-email.validator";
import { UniquePhone } from "src/utils/validations/unique-phone.validator";

export class RegisterRequest {
    @ApiProperty()
    @IsNotEmpty() @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty() @IsEmail() @UniqueEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty() @IsPhoneNumber('SA') @UniquePhone()
    phone: string;

    @ApiProperty({ type: 'file', required: false })
    @IsOptional()
    avatarFile: Express.Multer.File;
}