import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseService } from 'src/utils/base/services/base.service';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersService extends BaseService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @Inject(REQUEST) request: Request,
    ) {
        super(usersRepository, request);
    }

    async isEmailUnique(email: string): Promise<boolean> {
        return await this.usersRepository.findOneBy({ email }) === undefined;
    }

    async isPhoneUnique(phone: string): Promise<boolean> {
        return await this.usersRepository.findOneBy({ phone }) === undefined;
    }
}
