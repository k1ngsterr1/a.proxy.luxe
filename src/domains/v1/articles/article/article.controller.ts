import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({ summary: 'Create new article' })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update article' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete article' })
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
