import { InjectRepository } from '@nestjs/typeorm';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
export class IsUniquePhone implements ValidatorConstraintInterface {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }
    async validate(phone: any, args: ValidationArguments) {
        const [exceptField = null] = args.constraints;

        if (!phone) return false;

        const user = await this.usersRepository.findOne({ where: { phone } });

        if (!user) return true;

        if (!exceptField) return false;

        const exceptFieldValue = (args.object as any)[exceptField];
        if (!exceptFieldValue) return false;

        return user[exceptField] === exceptFieldValue;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} is already in use`;
    }
}

export function UniquePhone(
    exceptField: string = null,
    validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [exceptField],
            validator: IsUniquePhone,
        });
    };
}