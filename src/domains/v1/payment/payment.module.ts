import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';

@Module({
  providers: [ConfigModule, PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
