import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { BaseTransaction } from 'src/utils/base/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { SendOtpRequest } from '../../dto/requests/send-otp.request';
import { OtpEntity } from '../../entities/otp.entity';

@Injectable()
export class SendOtpTransaction extends BaseTransaction<SendOtpRequest, string> {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    // the important thing here is to use the manager that we've created in the base class
    protected async execute(req: SendOtpRequest, manager: EntityManager): Promise<string> {
        const user = await manager.findOneBy<UserEntity>(UserEntity, { [req.type]: req.username });
        // generate code
        const code = Math.floor(1000 + Math.random() * 9000);
        // map to otp entity
        const otp = plainToClass(OtpEntity, { ...req, code });
        // delete old otp
        await manager.delete(OtpEntity, { type: req.type, username: user[req.type] });
        // save otp
        await manager.save(OtpEntity, otp);
        // return code
        return code.toString();
    }

}