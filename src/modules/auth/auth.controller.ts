import {
    ClassSerializerInterceptor,
    Controller,
    Post,
    Body,
    UseInterceptors,
    HttpCode,
    UploadedFile,
    ParseFilePipeBuilder,
    HttpStatus,
    Inject
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { ActionResponse } from 'src/utils/responses/action.response';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/requests/register.request';
import { SendOtpRequest } from './dto/requests/send-otp.request';
import { LoginRequest } from './dto/requests/signin.request';
import { VerifyOtpRequest } from './dto/requests/verify-otp.request';
import { AuthResponse } from './dto/responses/auth.response';
import { RegisterResponse } from './dto/responses/register.response';
import { RateLimit } from 'nestjs-rate-limiter'

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
@Controller()
export class AuthController {
    constructor(@Inject(AuthService) private readonly authService: AuthService) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('/signin') @HttpCode(200)
    async signin(@Body() req: LoginRequest): Promise<ActionResponse<AuthResponse>> {
        const authData = await this.authService.login(await this.authService.validateUser(req));
        const result = plainToClass(AuthResponse, authData, { excludeExtraneousValues: true });
        return new ActionResponse<AuthResponse>(result);
    }

    @RateLimit({ keyPrefix: 'send-otp', points: 3, duration: 60, errorMessage: 'Please wait a few minutes before sending again.' })
    @Post('/send-otp') @HttpCode(200)
    async snedOtp(@Body() req: SendOtpRequest): Promise<ActionResponse<string>> {
        const result = await this.authService.sendOtp(req);
        return new ActionResponse<string>(result.toString());
    }

    @Post('/verify-otp') @HttpCode(200)
    async verifyOtp(@Body() req: VerifyOtpRequest): Promise<ActionResponse<AuthResponse>> {
        const data = await this.authService.verifyOtp(req);
        const result = plainToClass(AuthResponse, data, { excludeExtraneousValues: true });
        return new ActionResponse<AuthResponse>(result);
    }

    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('avatarFile'))
    @Post('/register')
    @ApiConsumes('multipart/form-data')
    async register(@UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({ fileType: 'jpg|jpeg|png' })
            .addMaxSizeValidator({ maxSize: 1024 * 1024 * 3 })
            .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    ) avatarFile: Express.Multer.File, @Body() req: RegisterRequest): Promise<ActionResponse<RegisterResponse>> {
        req.avatarFile = avatarFile;
        const user = await this.authService.register(req);
        const result = plainToClass(RegisterResponse, user, { excludeExtraneousValues: true });
        return new ActionResponse<RegisterResponse>(result, { statusCode: HttpStatus.CREATED });
    }
}
