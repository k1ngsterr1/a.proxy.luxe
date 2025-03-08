import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CalcRequestDTO {
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
  protocol: string;

  @IsOptional()
  @IsString()
  customTargetName: string;
}

export interface CalcResidentRequestDTO {
  tariffId: number;
  quantity: number;
}
