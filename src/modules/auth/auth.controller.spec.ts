import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/requests/register.request';

describe('AuthController', () => {
    let authController: AuthController;
    let user: User;

    beforeEach(async () => {
        const auth: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
            controllers: [AuthController],
        }).compile();

        authController = auth.get<AuthController>(AuthController);
    });

    describe('root', () => {
        it('should register a user"', async () => {
            const req = new RegisterRequest();
            req.name = 'test';
            req.email = 'test@test.com';
            req.avatarFile = null;
            req.phone = '+1234567890';

            const result = await authController.register(null, req) as any;

            expect(result.data.username).toBe(user.phone);
            expect(authController).toBeDefined();
        });
    });
});
