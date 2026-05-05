import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { LocaleCode } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('public')
  getPublicProducts(
    @Query('locale') locale: LocaleCode,
    @Query('categorySlug') categorySlug?: string,
    @Query('isFeatured') isFeatured?: string,
  ) {
    return this.productsService.getPublicProducts(locale, categorySlug, isFeatured);
  }

  @Get('public/:slug')
  getPublicProductDetail(
    @Param('slug') slug: string,
    @Query('locale') locale: LocaleCode,
  ) {
    return this.productsService.getPublicProductDetail(slug, locale);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminProducts() {
    return this.productsService.getAdminProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  getAdminProductById(@Param('id') id: string) {
    return this.productsService.getAdminProductById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }
}
