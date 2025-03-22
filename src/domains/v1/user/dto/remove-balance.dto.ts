import { User } from '@prisma/client';
import { IsNumber, IsEmail, IsObject, IsOptional } from 'class-validator';

export class RemoveBalanceDTO {
  @IsEmail()
  email: string;

  @IsNumber()
  amount: number;

  @IsObject()
  @IsOptional()
  user: User;
}
