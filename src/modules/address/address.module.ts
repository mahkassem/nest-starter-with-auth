import { AddressService } from './address.service';
import { AddressController } from './address.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AddressEntity } from './entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([AddressEntity])],
    controllers: [
        AddressController
    ],
    providers: [
        AddressService
    ],
})
export class AddressModule { }
