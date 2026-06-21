import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, UseGuards, Req, Res, Headers, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join, resolve, extname } from 'path';

// Define the root upload directory, ensuring it's relative to the project structure
const UPLOADS_DIR = join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

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
    // Hotlink Protection
    const allowedDomainsStr = this.configService.get<string>('ALLOWED_DOMAINS') || 'localhost,127.0.0.1';
    const allowedDomains = allowedDomainsStr.split(',').map(d => d.trim());

    if (referer || origin) {
      const source = referer || origin || '';
      try {
        const url = new URL(source);
        if (!allowedDomains.includes(url.hostname)) {
          throw new ForbiddenException('Hotlinking is not allowed');
        }
      } catch (e) {
        if (e instanceof ForbiddenException) throw e;
        // if URL parsing fails, allow the request (direct browser access)
      }
    }

    const filePath = join(UPLOADS_DIR, storageKey);
    const resolvedPath = resolve(filePath);
    const resolvedUploadsDir = resolve(UPLOADS_DIR);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      throw new ForbiddenException('Invalid file path');
    }

    if (!existsSync(resolvedPath)) {
      throw new NotFoundException('File not found');
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
