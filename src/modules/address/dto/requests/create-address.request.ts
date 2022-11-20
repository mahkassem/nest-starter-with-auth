import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateAddressRequest {
    @ApiProperty()
    @IsNotEmpty() @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty() @IsString()
    zip_code: string;

    @ApiProperty()
    @IsNotEmpty() @IsString()
    address: string;

    @ApiProperty()
    @IsNotEmpty() @IsString() @Matches(/^-?\d{1,3}\.\d{1,10}$/)
    latitude: number;

    @ApiProperty()
    @IsNotEmpty() @IsString() @Matches(/^-?\d{1,3}\.\d{1,10}$/)
    longitude: number;
}