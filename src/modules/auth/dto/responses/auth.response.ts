import { PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { RegisterResponse } from "./register.response";

export class AuthResponse extends PartialType(RegisterResponse) {
    @Expose() access_token: string;
}