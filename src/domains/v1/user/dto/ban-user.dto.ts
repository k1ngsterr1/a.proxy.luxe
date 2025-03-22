import { User } from '@prisma/client';
import { IsEmail, IsObject, IsOptional } from 'class-validator';

export class BanUserDTO {
  @IsEmail()
  email: string;

  @IsObject()
  @IsOptional()
  user: User;
}
