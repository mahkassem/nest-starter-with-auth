import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../enums/role.enum';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(UserEntity) private readonly user: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) { }

  async seed(): Promise<any> {
    // Generate 10 users.
    const users = DataFactory.createForClass(UserEntity).generate(10);

    // create super admin
    const superAdmin = new UserEntity({
      name: 'Super Admin',
      username: 'superadmin',
      password: await bcrypt.hash('secret' + this.configService.get('app.key'), bcrypt.genSaltSync(10)),
      email: 'super@app.com',
      email_verified_at: new Date(),
      phone: '+966500000000',
      phone_verified_at: new Date(),
      avatar: 'https://i.pravatar.cc/150?img=1',
      roles: [Role.ADMIN, Role.SUPERADMIN],
      gender: null,
    });

    users[0] = superAdmin;

    // Insert into the database with relations.
    return this.user.save(users);
  }

  async drop(): Promise<any> {
    return this.user.delete({});
  }
}
