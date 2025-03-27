import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FinishOrderDto {
  @IsUUID()
  orderId: string;

  @IsString()
  @IsOptional()
  promocode: string;
}
