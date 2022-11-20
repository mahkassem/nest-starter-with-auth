import config from './config';
import TypeormService from './config/typeorm.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DriverType } from '@codebrew/nestjs-storage';
import { StorageModule } from '@codebrew/nestjs-storage';
import { FileModule } from './modules/file/file.module';
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter';

@Module({
  imports: [
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormService,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/v1*'],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    StorageModule.forRoot({
      default: 'local',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: process.cwd(),
          },
        },
        s3: {
          driver: DriverType.S3,
          config: {
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => (
              config.get<string>('app.s3')
            ),
            inject: [ConfigService],
          },
        },
      },
    }),
    RateLimiterModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: RateLimiterGuard,
    }
  ],
})
export class AppModule { }
