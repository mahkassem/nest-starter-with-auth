import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { User } from './modules/users/entities/user.entity';
import { UsersSeeder } from './modules/users/data/seeders/users.seeder';
import { ConfigModule } from '@nestjs/config';
import config from './config';

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config().database.host,
      port: config().database.port,
      username: config().database.username,
      password: config().database.password,
      database: config().database.database,
      entities: [User],
    }),
    TypeOrmModule.forFeature([User]),
  ],
}).run([UsersSeeder]);
