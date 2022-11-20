import { Factory } from 'nestjs-seeder';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('addresses')
export class AddressEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @ManyToOne(() => UserEntity, (user) => user.addresses, {
        nullable: false,
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: Promise<UserEntity>;

    // address name e.g. home, work, etc.
    @Factory((faker) => faker.helpers.arrayElement(['home', 'work', 'other']))
    @Column({ length: 100 })
    name: string;

    // zip code
    @Factory((faker) => faker.address.zipCode())
    @Column({ length: 10 })
    zip_code: string;

    // address
    @Factory((faker) => faker.address.streetAddress())
    @Column({ length: 100 })
    address: string;

    // latitude
    @Factory((faker) => faker.address.latitude())
    @Column({ type: 'float' })
    latitude: number;

    // longitude
    @Factory((faker) => faker.address.longitude())
    @Column({ type: 'float' })
    longitude: number;

    @Factory((faker, ctx) => faker.date.past())
    @Column({ nullable: true })
    last_used_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // expire after 5 minutes
    public isExpired(): boolean {
        return new Date().getTime() - this.created_at.getTime() > 5 * 60 * 1000;
    }

    constructor(partial?: Partial<AddressEntity>) {
        Object.assign(this, partial);
    }
}