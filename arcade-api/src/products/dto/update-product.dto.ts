import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SpecDto {
  @IsString()
  key!: string;

  @IsString()
  value!: string;
}

class OptionDto {
  @IsString()
  key!: string;

  @IsString()
  value!: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  voltage?: string;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  playerCount?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  moq?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  leadTimeDays?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  warrantyMonths?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SpecDto)
  specs?: SpecDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  customizationOptions?: OptionDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaIds?: string[];
}
