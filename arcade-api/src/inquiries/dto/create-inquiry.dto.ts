import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  locale!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  contactName!: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  companyName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  whatsapp?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  wechat?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message!: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  sourceChannel?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  sessionDuration?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  pageViews?: number;
}
