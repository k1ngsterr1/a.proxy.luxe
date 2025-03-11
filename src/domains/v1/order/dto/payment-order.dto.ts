import { IsUUID } from 'class-validator';

export class FinishOrderDto {
  @IsUUID()
  orderId: string;
}
