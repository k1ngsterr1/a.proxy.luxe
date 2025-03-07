import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, ProxyType } from '@prisma/client';

export class OrderDto {
  @ApiProperty({ example: 'uuid', description: 'ID заказа' })
  id: string;

  @ApiProperty({ example: 'uuid', description: 'ID пользователя' })
  userId: string;

  @ApiProperty({ example: 'uuid', description: 'ID продукта' })
  productId: string;

  @ApiProperty({ example: 'Kazakhstan', description: 'Страна' })
  country: string;

  @ApiProperty({ example: 2, description: 'Количество' })
  quantity: number;

  @ApiProperty({ example: 30, description: 'Количество дней аренды' })
  periodDays: number;

  @ApiProperty({ enum: ProxyType, description: 'Тип прокси' })
  proxyType: ProxyType;

  @ApiProperty({ enum: PaymentStatus, description: 'Статус оплаты' })
  status: PaymentStatus;

  @ApiProperty({ example: 100.5, description: 'Общая стоимость' })
  totalPrice: number;

  @ApiProperty({ example: new Date(), description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ example: new Date(), description: 'Дата обновления' })
  updatedAt: Date;
}
