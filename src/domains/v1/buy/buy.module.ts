import { Module } from '@nestjs/common';
import { BuyService } from './buy.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ConfigModule, BuyService],
})
export class BuyModule {}
