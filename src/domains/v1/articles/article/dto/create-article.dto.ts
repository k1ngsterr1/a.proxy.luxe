import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seo_keywords?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  seo_description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category_id: string;
}
