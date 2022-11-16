import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100, default: 'phone' })
    type: string;

    @Column({ length: 100 })
    username: string;

    @Column({ length: 4 })
    code: string;

    @CreateDateColumn()
    created_at: Date;

    // expire after 5 minutes
    public isExpired(): boolean {
        return new Date().getTime() - this.created_at.getTime() > 5 * 60 * 1000;
    }
}