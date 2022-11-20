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
import { UserEntity } from '../users/entities/user.entity';
import { OtpEntity } from './entities/otp.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUtil } from './utils/auth.util';
import { SendOtpTransaction } from './utils/transactions/send-otp.transaction';
import { UsersService } from '../users/users.service';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => (
                {
                    defaultStrategy: JwtStrategy,
                    secret: config.get<string>('app.key'),
                    signOptions: { expiresIn: '180d' },
                }
            ),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserEntity, OtpEntity]),
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, AuthUtil, SendOtpTransaction, JwtStrategy, IsUniqueEmail, IsUniquePhone],
    exports: [AuthService],
})
export class AuthModule { }
