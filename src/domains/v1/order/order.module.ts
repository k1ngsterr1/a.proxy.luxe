import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SharedModule } from '../shared/shared.module';
import { ProductModule } from 'src/domains/product/product.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SharedModule, ProductModule, UserModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
