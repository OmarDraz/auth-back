import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class NameConstraint implements ValidatorConstraintInterface {
  validate(name: string, args: ValidationArguments) {
    if (!name) return false;
    
    // Check minimum length of 3 characters
    if (name.length < 3) return false;
    
    // Check if it contains only letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(name)) return false;
    
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Name must be at least 3 characters long and contain only letters, spaces, hyphens, and apostrophes';
  }
}

export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NameConstraint,
    });
  };
}
