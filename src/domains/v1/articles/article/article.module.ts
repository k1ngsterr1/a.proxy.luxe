import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule, CategoryModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
