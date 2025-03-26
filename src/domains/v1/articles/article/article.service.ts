import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CategoryService } from '../category/category.service';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const category = await this.categoryService.findOne(
      createArticleDto.category_id,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        content: createArticleDto.content,
        image: createArticleDto.image,
        seoKeywords: createArticleDto.seo_keywords,
        seoDescription: createArticleDto.seo_description,
        categoryId: createArticleDto.category_id,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await this.prisma.article.findMany({
      skip,
      take: limit,
      include: { category: true },
    });
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.findOne(id);

    if (updateArticleDto.category_id) {
      const category = await this.categoryService.findOne(
        updateArticleDto.category_id,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        title: updateArticleDto.title ?? article.title,
        content: updateArticleDto.content ?? article.content,
        image: updateArticleDto.image ?? article.image,
        seoKeywords: updateArticleDto.seo_keywords ?? article.seoKeywords,
        seoDescription:
          updateArticleDto.seo_description ?? article.seoDescription,
        categoryId: updateArticleDto.category_id ?? article.categoryId,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.article.delete({ where: { id } });
  }
}
