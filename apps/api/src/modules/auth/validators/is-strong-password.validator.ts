import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';
import { isStrongPassword, PASSWORD_POLICY_MESSAGE } from '@codequest/shared';

export function IsStrongPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    registerDecorator({
      name: 'isStrongPassword',
      target: target.constructor,
      propertyName: propertyKey.toString(),
      options: { message: PASSWORD_POLICY_MESSAGE, ...validationOptions },
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          return typeof value === 'string' && isStrongPassword(value);
        },
        defaultMessage: () => PASSWORD_POLICY_MESSAGE,
      },
    });
  };
}
