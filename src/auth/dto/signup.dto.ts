import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidName } from '../validators/name.validator';
import { IsStrongPassword } from '../validators/password.validator';

export class SignupDto {
  @ApiProperty({
    description: 'User full name (minimum 3 characters)',
    example: 'John Doe',
    minLength: 3,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @IsValidName({ message: 'Name must be at least 3 characters long and contain only letters, spaces, hyphens, and apostrophes' })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters with letter, number, and special character)',
    example: 'Password123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @IsStrongPassword({ message: 'Password must be at least 8 characters long and contain at least one letter, one number, and one special character' })
  password: string;
}
