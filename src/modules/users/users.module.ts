import { UsersService } from './users.service';
import { UsersController } from './users.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsUniquePhone } from 'src/utils/validations/unique-phone.validator';
import { IsUniqueEmail } from 'src/utils/validations/unique-email.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, IsUniqueEmail, IsUniquePhone],
  exports: [UsersService],
})
export class UsersModule {}
