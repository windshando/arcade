import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, UseGuards, Req, Res, BadRequestException } from '@nestjs/common';
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
  ) {
    // Note: Referer-based hotlink protection was removed — it blocked the frontend
    // from loading images. CORS (configured in main.ts) handles cross-origin security.
    // To re-enable, set ALLOWED_DOMAINS env var and check Referer/Origin headers here.

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
