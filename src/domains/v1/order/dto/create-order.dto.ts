import {
  IsUUID,
  IsString,
  IsInt,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ProxyType, Proxy } from '@prisma/client';

export class CreateOrderDto {
  @IsOptional()
  @IsUUID()
  userId: string;

  @IsString()
  country: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsString()
  periodDays: string;

  @IsInt()
  totalPrice: number;

  @IsEnum(ProxyType)
  proxyType: ProxyType;

  @IsEnum(Proxy)
  type: Proxy;
}
