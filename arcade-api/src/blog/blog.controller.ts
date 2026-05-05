import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { LocaleCode } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlogPostDto } from './dto/blog-post.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('public/posts')
  getPublicPosts(@Query('locale') locale: LocaleCode) {
    return this.blogService.getPublicPosts(locale);
  }

  @Get('public/posts/:slug')
  getPublicPostDetail(
    @Param('slug') slug: string,
    @Query('locale') locale: LocaleCode,
  ) {
    return this.blogService.getPublicPostDetail(slug, locale);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/posts')
  getAdminPosts() {
    return this.blogService.getAdminPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/categories')
  getAdminCategories() {
    return this.blogService.getAdminCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/posts')
  createPost(@Body() dto: BlogPostDto) {
    return this.blogService.createPost(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/posts/:id')
  updatePost(@Param('id') id: string, @Body() dto: BlogPostDto) {
    return this.blogService.updatePost(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/posts/:id')
  deletePost(@Param('id') id: string) {
    return this.blogService.deletePost(id);
  }
}
