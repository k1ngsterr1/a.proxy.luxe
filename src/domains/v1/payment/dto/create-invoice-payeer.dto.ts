import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateInvoicePayeer {
  @IsString()
  orderId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
