import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, UseGuards, Req, Res, Headers, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { join, resolve, extname } from 'path';

// Define the root upload directory, ensuring it's relative to the project structure
const UPLOADS_DIR = join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

// Ensure the uploads directory exists (multer diskStorage does NOT create it automatically)
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('admin/upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException('Invalid file type'), false);
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: UPLOADS_DIR,
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return this.mediaService.saveMediaRecord(file, req.user.id);
  }

  @Get('public/:storageKey')
  async serveFile(
    @Param('storageKey') storageKey: string,
    @Res() res: Response,
    @Headers('referer') referer?: string,
    @Headers('origin') origin?: string,
  ) {
    // Hotlink Protection — build allow-list from all known domain sources
    const extractHostnames = (str: string): string[] =>
      str.split(',').map(d => {
        try { return new URL(d.trim()).hostname; } catch { return d.trim(); }
      }).filter(Boolean);

    const allowedDomainsEnv = process.env.ALLOWED_DOMAINS || '';
    const corsOriginEnv = process.env.CORS_ORIGIN || '';
    const apiBaseUrlEnv = process.env.API_BASE_URL || '';

    // Merge all known domain sources
    const allSources = [allowedDomainsEnv, corsOriginEnv, apiBaseUrlEnv].filter(Boolean);

    // If no domains are explicitly configured, skip hotlink protection entirely
    if (allSources.length > 0 && (referer || origin)) {
      const allowedDomains = new Set([
        ...extractHostnames(allowedDomainsEnv),
        ...extractHostnames(corsOriginEnv),
        ...extractHostnames(apiBaseUrlEnv),
        'localhost', '127.0.0.1',
      ]);

      const source = referer || origin || '';
      try {
        const url = new URL(source);
        if (!allowedDomains.has(url.hostname)) {
          return res.status(403).end();
        }
      } catch {
        // if URL parsing fails, allow the request (direct browser access)
      }
    }

    const filePath = join(UPLOADS_DIR, storageKey);
    const resolvedPath = resolve(filePath);
    const resolvedUploadsDir = resolve(UPLOADS_DIR);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return res.status(403).end();
    }

    if (!existsSync(resolvedPath)) {
      return res.status(404).end();
    }
    
    // We can also retrieve the mimeType from DB for correct content-type header
    const mediaRecord = await this.mediaService.getMediaRecord(storageKey);
    if (mediaRecord?.mimeType) {
      res.setHeader('Content-Type', mediaRecord.mimeType);
    }
    // Cache static media files for 1 year in production
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const fileStream = createReadStream(resolvedPath);
    fileStream.pipe(res);
  }
}
