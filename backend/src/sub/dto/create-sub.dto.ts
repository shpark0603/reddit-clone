import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;
}
