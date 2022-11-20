import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly configService: ConfigService,
  ) { }

  async seed(): Promise<any> {
    // Generate 10 users.
    const users = DataFactory.createForClass(User).generate(10);

    // create super admin
    users[0].name = 'Super Admin';
    users[0].username = 'superadmin';
    users[0].password = await bcrypt.hash('secret', bcrypt.genSaltSync(10));
    users[0].email = 'super@app.com';
    users[0].email_verified_at = new Date();
    users[0].phone = '+966500000000';
    users[0].phone_verified_at = new Date();
    users[0].avatar = 'https://i.pravatar.cc/150?img=1';

    // Insert into the database.
    return this.user.insert(users);
  }

  async drop(): Promise<any> {
    return this.user.delete({});
  }
}
