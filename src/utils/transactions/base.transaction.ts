import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import env from '../helpers/env.helper';

@Injectable()
export abstract class BaseTransaction<TransactionInput, TransactionOutput> {
    protected constructor(
        private readonly dataSource: DataSource,
    ) { }

    // this function will contain all of the operations that you need to perform
    // and has to be implemented in all transaction classes
    protected abstract execute(
        data: TransactionInput,
        manager: EntityManager
    ): Promise<TransactionOutput>;

    private async createRunner(): Promise<QueryRunner> {
        return this.dataSource.createQueryRunner();
    }

    // this is the main function that runs the transaction
    async run(data: TransactionInput): Promise<TransactionOutput> {
        // since everything in Nest.js is a singleton we should create a separate
        // QueryRunner instance for each call
        const queryRunner = await this.createRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await this.execute(data, queryRunner.manager);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(env('ENV') !== 'prod' ? error.message : 'Something went wrong');
        } finally {
            await queryRunner.release();
        }
    }

    // this is a function that allows us to use other "transaction" classes
    // inside of any other "main" transaction, i.e. without creating a new DB transaction
    async runWithinTransaction(
        data: TransactionInput,
        manager: EntityManager,
    ): Promise<TransactionOutput> {
        return this.execute(data, manager);
    }
}