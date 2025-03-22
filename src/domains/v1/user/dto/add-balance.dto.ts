import { User } from '@prisma/client';
import { IsEmail, IsNumber, IsObject, IsOptional } from 'class-validator';

export class AddBalanceDTO {
  @IsEmail()
  email: string;

  @IsNumber()
  amount: number;

  @IsObject()
  @IsOptional()
  user: User;
}
