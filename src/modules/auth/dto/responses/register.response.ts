/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Exclude, Expose } from "class-transformer";
import env from "src/utils/helpers/env.helper";

export class RegisterResponse {
    @Expose() id: string;
    @Expose() name: string;
    @Exclude() private _avatar: string;
    @Expose({ name: "avatar" })
    public get avatar(): string {
        const host = env("APP_HOST");
        return `${host}/v1/${this._avatar}`;
    }
    @Expose() username: string;
    @Expose() email: string;
    @Expose() email_verified_at: Date;
    @Expose() phone: string;
    @Expose() phone_verified_at: Date;

    public set avatar(value: string) {
        this._avatar = value;
    }

    public getAvatar(): string {
        return this._avatar;
    }
}