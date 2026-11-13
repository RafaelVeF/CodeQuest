import { IsEmail, IsIn, IsOptional, Matches } from 'class-validator';
import type { SupportedLanguage } from '@codequest/shared';
import { IsStrongPassword } from '../validators/is-strong-password.validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @Matches(/^[A-Za-z0-9_-]{3,20}$/)
  pseudo!: string;

  @IsStrongPassword()
  password!: string;

  @IsOptional()
  @IsIn(['python', 'javascript', 'java', 'cpp'])
  preferredLanguage?: SupportedLanguage;
}
