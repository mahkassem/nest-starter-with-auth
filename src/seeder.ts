import config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { UserEntity } from './modules/users/entities/user.entity';
import { UsersSeeder } from './modules/users/data/seeders/users.seeder';
import { ConfigModule } from '@nestjs/config';
import { AddressEntity } from './modules/address/entities/address.entity';
import { AddressSeeder } from './modules/address/data/address.seeder';

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
      entities: [UserEntity, AddressEntity],
    }),
    TypeOrmModule.forFeature([UserEntity, AddressEntity]),
  ],
}).run([UsersSeeder, AddressSeeder]);
