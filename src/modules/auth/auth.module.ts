import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IsUniqueEmail } from '../../utils/validations/unique-email.validator';
import { IsUniquePhone } from '../../utils/validations/unique-phone.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Otp } from './entities/otp.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUtil } from './utils/auth.util';
import { SendOtpTransaction } from './utils/transactions/send-otp.transaction';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => (
                {
                    secret: config.get<string>('app.key'),
                    signOptions: { expiresIn: '180d' },
                }
            ),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User, Otp]),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthUtil, SendOtpTransaction, JwtStrategy, IsUniqueEmail, IsUniquePhone],
    exports: [AuthService],
})
export class AuthModule { }
