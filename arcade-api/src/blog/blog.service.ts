import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocaleCode } from '@prisma/client';
import { BlogPostDto } from './dto/blog-post.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicPosts(locale: LocaleCode = 'EN') {
    const formattedLocale = (locale || 'EN').replace('-', '_').toUpperCase() as LocaleCode;
    const posts = await this.prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: {
        category: true,
        translations: { where: { locale: formattedLocale } },
      },
    });

    return posts.map(post => {
      const t = post.translations[0];
      return {
        id: post.id,
        slug: post.slug,
        category: post.category?.slug,
        title: t?.title || post.slug,
        excerpt: t?.excerpt || '',
        publishedAt: post.publishedAt,
        coverMediaId: post.coverMediaId,
      };
    });
  }

  async getPublicPostDetail(slug: string, locale: LocaleCode = 'EN') {
    const formattedLocale = (locale || 'EN').replace('-', '_').toUpperCase() as LocaleCode;
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        translations: { where: { locale: formattedLocale } },
      },
    });

    if (!post || post.status !== 'PUBLISHED') throw new NotFoundException();

    const t = post.translations[0];
    return {
      id: post.id,
      slug: post.slug,
      category: post.category?.slug,
      title: t?.title || post.slug,
      excerpt: t?.excerpt || '',
      content: t?.content || '',
      seoTitle: t?.seoTitle,
      seoDescription: t?.seoDescription,
      publishedAt: post.publishedAt,
      coverMediaId: post.coverMediaId,
    };
  }

  async getAdminPosts() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        translations: true,
      },
    });
  }

  async getAdminCategories() {
    return this.prisma.blogCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { translations: true }
    });
  }

  async createPost(dto: BlogPostDto) {
    const locale = dto.locale || 'EN';
    const publishedAt = dto.status === 'PUBLISHED' ? new Date() : null;

    return this.prisma.blogPost.create({
      data: {
        slug: dto.slug,
        status: dto.status,
        categoryId: dto.categoryId || null,
        coverMediaId: dto.coverMediaId || null,
        publishedAt,
        translations: {
          create: {
            locale,
            title: dto.title,
            excerpt: dto.excerpt,
            content: dto.content,
          },
        },
      },
    });
  }

  async updatePost(id: string, dto: BlogPostDto) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();

    const locale = dto.locale || 'EN';
    let publishedAt = post.publishedAt;

    if (post.status !== 'PUBLISHED' && dto.status === 'PUBLISHED') {
      publishedAt = new Date();
    } else if (dto.status !== 'PUBLISHED') {
      publishedAt = null;
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        slug: dto.slug,
        status: dto.status,
        categoryId: dto.categoryId || null,
        coverMediaId: dto.coverMediaId || null,
        publishedAt,
        translations: {
          upsert: {
            where: { postId_locale: { postId: id, locale } },
            create: {
              locale,
              title: dto.title,
              excerpt: dto.excerpt,
              content: dto.content,
            },
            update: {
              title: dto.title,
              excerpt: dto.excerpt,
              content: dto.content,
            },
          },
        },
      },
    });
  }

  async deletePost(id: string) {
    return this.prisma.blogPost.delete({ where: { id } });
  }
}

