import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seo_keywords?: string[];

  @IsOptional()
  @IsString()
  seo_description?: string;

  @IsString()
  @IsNotEmpty()
  category_id: string;
}
