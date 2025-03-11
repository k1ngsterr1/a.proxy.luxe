import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Proxy } from '@prisma/client';

export class CalcRequestDTO {
  @IsEnum(Proxy)
  type: Proxy;

  @IsInt()
  countryId: number;

  @IsString()
  periodId: string;

  @IsInt()
  @Min(1, { message: 'Количество должно быть не менее 10' })
  quantity: number;

  @IsIn(['HTTPS', 'SOCKS5'], {
    message: 'Протокол должен быть HTTPS или SOCKS5',
  })
  @IsOptional()
  protocol?: string;

  @IsOptional()
  @IsString()
  customTargetName: string;
}

export class CalcResidentRequestDTO {
  @IsInt()
  tariffId: number;

  @IsString()
  quantity: string;
}
