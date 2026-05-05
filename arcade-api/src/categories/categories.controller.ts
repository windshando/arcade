import { Controller, Get, Query, UseGuards, Post, Put, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { LocaleCode } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('public')
  getPublicCategories(@Query('locale') locale: LocaleCode) {
    return this.categoriesService.getPublicCategories(locale);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminCategories() {
    return this.categoriesService.getAdminCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  async deleteCategory(@Param('id') id: string) {
    try {
      return await this.categoriesService.deleteCategory(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Cannot delete category');
    }
  }
}
