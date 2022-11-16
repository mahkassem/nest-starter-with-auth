import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import env from '../utils/helpers/env.helper';

@Injectable()
export default class TypeormService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: (env('DB_CONN') as any) || 'mysql',
      host: env('DB_HOST') || 'localhost',
      port: parseInt(env('DB_PORT'), 10) || 3306,
      database: env('DB_NAME'),
      username: env('DB_USER'),
      password: env('DB_PASS'),
      entities: [],
      synchronize: env('DB_SYNC') === 'true' || false,
      autoLoadEntities: env('DB_AUTOLOAD') === 'true' || false,
      cache: {
        type: (env('CACHE_TYPE') as any) || 'database',
        duration: parseInt(env('CACHE_DURATION'), 10) || 60,
      },
    };
  }
}
