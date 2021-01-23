import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @MinLength(2)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
