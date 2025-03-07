import { IsUUID, IsString, IsInt, IsPositive, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProxyType } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID пользователя' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'ID продукта' })
  @IsUUID()
  product_id: string;

  @ApiProperty({ example: 'RU', description: 'Страна прокси' })
  @IsString()
  country: string;

  @ApiProperty({ example: 10, description: 'Количество прокси' })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 30, description: 'Период действия (дни)' })
  @IsInt()
  @IsPositive()
  period_days: number;

  @ApiProperty({
    enum: ProxyType,
    example: ProxyType.HTTP,
    description: 'Тип прокси',
  })
  @IsEnum(ProxyType)
  proxy_type: ProxyType;
}
