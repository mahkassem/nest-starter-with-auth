/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from './dto/requests/signin.request';
import * as bcrypt from 'bcrypt';
import { RegisterRequest } from './dto/requests/register.request';
import { StorageService } from '@codebrew/nestjs-storage/dist';
import { ConfigService } from '@nestjs/config';
import { OtpEntity } from './entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendOtpRequest } from './dto/requests/send-otp.request';
import { VerifyOtpRequest } from './dto/requests/verify-otp.request';
import { randStr } from 'src/utils/helpers/string.helper';
import { AuthUtil } from './utils/auth.util';
import { SendOtpTransaction } from './utils/transactions/send-otp.transaction';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UsersService) private readonly usersService: UsersService,
        @Inject(JwtService) private readonly jwtService: JwtService,
        @Inject(StorageService) private readonly storage: StorageService,
        @Inject(ConfigService) private readonly config: ConfigService,
        @InjectRepository(OtpEntity) private otpsRepository: Repository<OtpEntity>,
        @Inject(AuthUtil) private readonly authUtil: AuthUtil,
        @Inject(SendOtpTransaction) private readonly sendOtpTransaction: SendOtpTransaction
    ) { }

    async validateUser(req: LoginRequest): Promise<any> {
        const user = await this.usersService.findOne([
            { email: req.username },
            { username: req.username },
            { phone: req.username }
        ]);
        let isMatch = false;
        if (user) {
            isMatch = await bcrypt.compare(req.password + this.config.get('app.key'), user.password);
        }
        if (user && isMatch) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        if (!user) throw new BadRequestException('Invalid credentials');
        const payload = { username: user.username, sub: user.id };
        return {
            ...user,
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(req: RegisterRequest) {
        // upload avatar
        const user = await this.authUtil.uploadAvatar(req)
        // encrypt password
        const randomPassword = randStr(12);
        user.password = await bcrypt.hash(randomPassword + this.config.get('app.key'), 10);
        user.username = user.phone;
        // save user
        const savedUser = await this.usersService.create(user);
        // return user
        return savedUser;
    }

    async sendOtp(req: SendOtpRequest) {
        const code = await this.sendOtpTransaction.run(req);
        // return code
        return code;
    }

    async verifyOtp(req: VerifyOtpRequest) {
        // find otp
        const otp = await this.otpsRepository.findOneBy({ type: req.type, username: req.username, code: req.code });
        if (!otp) throw new BadRequestException('Invalid code');
        if (otp.isExpired()) throw new BadRequestException('Code expired');

        // find the user
        const user = await this.usersService.findOne({ [req.type]: req.username });
        if (!user) throw new BadRequestException('User not found');

        // delete otp
        await this.otpsRepository.remove(otp);

        // update user ${req.type}_verified_at if not verified
        if (!user[`${req.type}_verified_at`]) {
            user[`${req.type}_verified_at`] = new Date();
            await this.usersService.update(user);
        }

        return this.login(user);
    }

    async getUserFromPayload(payload: any) {
        return payload;
    }
}