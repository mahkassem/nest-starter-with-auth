import { InjectRepository } from '@nestjs/typeorm';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
export class IsUniqueEmail implements ValidatorConstraintInterface {
    constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) { }
    async validate(email: any, args: ValidationArguments) {
        const [exceptField = null] = args.constraints;

        if (!email) return false;

        const user = await this.usersRepository.findOne({ where: { email } });

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

export function UniqueEmail(
    exceptField: string = null,
    validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [exceptField],
            validator: IsUniqueEmail,
        });
    };
}