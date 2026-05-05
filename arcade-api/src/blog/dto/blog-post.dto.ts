import { IsString, IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { LocaleCode } from '@prisma/client';

export class BlogPostDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  categoryId?: string | null;

  @IsOptional()
  coverMediaId?: string | null;

  @IsString()
  @IsIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  @IsString()
  @IsOptional()
  locale?: LocaleCode = 'EN';
}
