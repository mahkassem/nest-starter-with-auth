import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { AddressEntity } from 'src/modules/address/entities/address.entity';

@Injectable()
export class AddressSeeder implements Seeder {
  constructor(
    @InjectRepository(UserEntity) private readonly user: Repository<UserEntity>,
    @InjectRepository(AddressEntity) private readonly address: Repository<AddressEntity>
  ) { }

  async seed(): Promise<any> {
    // Generate 10 users.
    const users = await this.user.createQueryBuilder('users')
      .select(['users.id', 'users.username'])
      .where('users.username != "superadmin"')
      .getMany();

    const addresses = [];
    // add address to users
    users.forEach((user, index) => {
      // generate random number between 1 and 5
      const randomAddressCount = Math.floor(0 + Math.random() * (4 - 0 + 1));
      if (randomAddressCount) {
        const userAddresses = DataFactory.createForClass(AddressEntity).generate(randomAddressCount);
        userAddresses.forEach((address) => {
          address.user_id = user.id;
          addresses.push(address);
        });
      }
    });

    // Insert into the database with relations.
    return this.address.save(addresses);
  }

  async drop(): Promise<any> {
    return this.address.delete({});
  }
}
