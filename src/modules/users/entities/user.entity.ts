import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Factory } from 'nestjs-seeder';
import { Gender } from '../data/enums/gender.enum';
import { Exclude } from 'class-transformer';
import { AddressEntity } from 'src/modules/address/entities/address.entity';
import { Role } from '../data/enums/role.enum';

@Entity('users')
export class UserEntity {
  [x: string]: any;
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker, ctx) => faker.name.fullName(ctx.gender))
  @Column({ length: 100 })
  name: string;

  @Factory((faker, ctx) => faker.helpers.unique(faker.internet.domainName))
  @Column({ length: 100, unique: true })
  username: string;

  @Exclude()
  @Factory((faker, ctx) => faker.internet.password())
  @Column({ length: 60 })
  password: string;

  @Factory((faker, ctx) => faker.internet.email(ctx.name))
  @Column({ nullable: true, length: 100 })
  email: string;

  @Factory((faker, ctx) => faker.date.future())
  @Column({ nullable: true })
  email_verified_at: Date;

  @Factory((faker, ctx) => faker.phone.number('+966#########'))
  @Column({ nullable: true, length: 20 })
  phone: string;

  @Factory((faker, ctx) => faker.date.future())
  @Column({ nullable: true })
  phone_verified_at: Date;

  @Factory((faker, ctx) => faker.internet.avatar())
  @Column({ nullable: true, length: 500 })
  avatar: string;

  @Factory((faker) => faker.helpers.arrayElement(Object.values(Gender)))
  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true, length: 500 })
  fcm_token: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: "set",
    enum: Role,
    default: [Role.USER],
  })
  roles: Role[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses: Promise<AddressEntity[]>;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
