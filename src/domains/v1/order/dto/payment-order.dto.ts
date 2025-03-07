import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentGateway } from '@prisma/client';

export class PaymentOrderDto {
  @ApiProperty({
    enum: PaymentGateway,
    description: 'Платежный шлюз',
  })
  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @ApiProperty({ description: 'ID заказа' })
  @IsUUID()
  order_id: string;
}
