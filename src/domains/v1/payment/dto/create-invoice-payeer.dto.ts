import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateInvoicePayeer {
  @IsOptional()
  @IsString()
  orderId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
