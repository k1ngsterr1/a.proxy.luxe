import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug: createCategoryDto.slug,
        description: createCategoryDto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name ?? category.name,
        slug: updateCategoryDto.slug ?? category.slug,
        description: updateCategoryDto.description ?? category.description,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
