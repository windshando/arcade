import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocaleCode } from '@prisma/client';

@Injectable()
export class NavigationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicMenu(key: string, locale: string = 'EN') {
    const formattedLocale = (locale || 'EN').replace('-', '_').toUpperCase() as LocaleCode;
    
    const menu = await this.prisma.navigationMenu.findUnique({
      where: { key },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            translations: {
              where: { locale: formattedLocale },
            },
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                translations: {
                  where: { locale: formattedLocale },
                }
              }
            }
          }
        }
      }
    });

    if (!menu) return { key, items: [] };

    // Format into hierarchical tree
    const rootItems = menu.items.filter(item => !item.parentId);
    
    return {
      key: menu.key,
      items: rootItems.map(item => ({
        id: item.id,
        url: item.url,
        isExternal: item.isExternal,
        label: item.translations[0]?.label || '---',
        children: item.children.map(child => ({
          id: child.id,
          url: child.url,
          isExternal: child.isExternal,
          label: child.translations[0]?.label || '---',
        }))
      }))
    };
  }

  async getAdminMenus() {
    return this.prisma.navigationMenu.findMany({
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
          include: { translations: true }
        }
      }
    });
  }

  async saveAdminMenu(key: string, items: any[]) {
    // 1. Ensure menu exists
    let menu = await this.prisma.navigationMenu.findUnique({ where: { key } });
    if (!menu) {
      menu = await this.prisma.navigationMenu.create({ data: { key } });
    }

    return this.prisma.$transaction(async (tx) => {
      // 2. Wipe existing items for this menu entirely so we can rebuild the tree
      await tx.navigationItem.deleteMany({ where: { menuId: menu.id } });

      // 3. Rebuild the tree
      let sortOrder = 0;
      const createdItems: any[] = [];
      for (const item of items) {
        const createdParent = await tx.navigationItem.create({
          data: {
            menuId: menu.id,
            url: item.url,
            isExternal: item.isExternal || false,
            isActive: item.isActive !== false,
            sortOrder: sortOrder++,
            translations: {
              create: [
                { locale: 'EN', label: item.labelEn || item.url },
                { locale: 'ZH_CN', label: item.labelZh || item.labelEn || item.url },
              ]
            }
          }
        });
        createdItems.push(createdParent);

        if (item.children && Array.isArray(item.children)) {
            let childOrder = 0;
            for (const child of item.children) {
                await tx.navigationItem.create({
                    data: {
                        menuId: menu.id,
                        parentId: createdParent.id,
                        url: child.url,
                        isExternal: child.isExternal || false,
                        isActive: child.isActive !== false,
                        sortOrder: childOrder++,
                        translations: {
                          create: [
                            { locale: 'EN', label: child.labelEn || child.url },
                            { locale: 'ZH_CN', label: child.labelZh || child.labelEn || child.url },
                          ]
                        }
                    }
                });
            }
        }
      }
      return createdItems;
    });
  }
}
