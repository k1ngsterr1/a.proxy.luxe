import { Module } from '@nestjs/common';
import { UserModule } from './v1/user/user.module';
import { AuthModule } from './v1/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { OrderModule } from './v1/order/order.module';
import { CategoryModule } from './v1/articles/category/category.module';
import { ArticleModule } from './v1/articles/article/article.module';
import { ServicesModule } from './v1/services/services.module';
import { BuyModule } from './v1/buy/buy.module';
import { SharedModule } from './v1/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductModule,
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    CategoryModule,
    ArticleModule,
    ServicesModule,
    BuyModule,
    SharedModule,
  ],
})
export class AppModule {}
