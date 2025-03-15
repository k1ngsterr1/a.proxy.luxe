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
  @IsOptional()
  country: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  periodDays: string;

  @IsString()
  @IsOptional()
  tariff: string;

  @IsString()
  @IsOptional()
  protocol: string;

  @IsEnum(ProxyType)
  @IsOptional()
  proxyType: ProxyType;

  @IsEnum(Proxy)
  type: Proxy;
}
