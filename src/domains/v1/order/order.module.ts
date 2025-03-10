import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SharedModule } from '../shared/shared.module';
import { ProductModule } from 'src/domains/product/product.module';

@Module({
  imports: [SharedModule, ProductModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
