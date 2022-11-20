import { Inject, Injectable, Scope, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { PaginatedRequest } from '../requests/paginated.request';
import { GlobalExceptionFilter } from '../../setup/exceptions/global-exception-filter';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

export interface IBaseService<T> {
    findAll(): Promise<T[]>;
    findOne(id: string): Promise<T>;
    create(entity: T): Promise<T>;
    update(id: string, entity: T): Promise<T>;
    delete(id: string): Promise<T>;
}


@Injectable({ scope: Scope.REQUEST })
export abstract class BaseService<T> {
    constructor(
        @InjectRepository(Repository<T>)
        private baseRepository: Repository<T>,
        @Inject(REQUEST) private request: Request,
    ) { }

    @UseInterceptors(GlobalExceptionFilter)
    async findAll(options?: PaginatedRequest): Promise<T[]> {
        let query: any;
        if (!isNaN(options.skip)) query = { skip: options.skip };
        if (!isNaN(options.take)) query = { ...query, take: options.take };
        if (options.where && options.where.length) query = { ...query, where: options.where };
        if (options.order) query = { ...query, order: options.order };
        if (options.relations) query = { ...query, relations: options.relations };
        return await this.baseRepository.find(query);
    }

    async findOne(column: string | Partial<T>): Promise<T> {
        const query = typeof column === 'string' ? { id: column } : column;
        return await this.baseRepository.createQueryBuilder().where(query).getOne();
    }

    async create(entity: T): Promise<T> {
        return await this.baseRepository.save(entity);
    }

    async update(entity: T): Promise<T> {
        return await this.baseRepository.save(entity);
    }

    async delete(id: string): Promise<DeleteResult> {
        return await this.baseRepository.delete(id);
    }

    async count(): Promise<number> {
        return await this.baseRepository.count();
    }
}
