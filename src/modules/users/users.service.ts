/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(column: string | Partial<User>): Promise<User> {
        const query = typeof column === 'string' ? { id: column } : column;
        return await this.usersRepository.findOneBy(query);
    }

    async isEmailUnique(email: string): Promise<boolean> {
        return await this.usersRepository.findOneBy({ email }) === undefined;
    }

    async isPhoneUnique(phone: string): Promise<boolean> {
        return await this.usersRepository.findOneBy({ phone }) === undefined;
    }

    async create(user: User): Promise<User> {
        return await this.usersRepository.save(user);
    }

    async update(id: string, user: User): Promise<User> {
        return await this.usersRepository.save({ id, ...user });
    }
}
