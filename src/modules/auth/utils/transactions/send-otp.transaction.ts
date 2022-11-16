import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseTransaction } from 'src/utils/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { SendOtpRequest } from '../../dto/requests/send-otp.request';
import { Otp } from '../../entities/otp.entity';

@Injectable()
export class SendOtpTransaction extends BaseTransaction<SendOtpRequest, string> {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    // the important thing here is to use the manager that we've created in the base class
    protected async execute(req: SendOtpRequest, manager: EntityManager): Promise<string> {
        const user = await manager.findOneBy<User>(User, { [req.type]: req.username });
        // generate code
        const code = Math.floor(1000 + Math.random() * 9000);
        // map to otp entity
        const otp = plainToClass(Otp, { ...req, code });
        // delete old otp
        await manager.delete(Otp, { type: req.type, username: user[req.type] });
        // save otp
        await manager.save(Otp, otp);
        // return code
        return code.toString();
    }

}