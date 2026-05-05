import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post('public/contact')
  @HttpCode(HttpStatus.CREATED)
  createContact(@Body() dto: CreateInquiryDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
    return this.inquiriesService.createInquiry(dto, 'CONTACT', userAgent, ipAddress);
  }

  @Post('public/quote')
  @HttpCode(HttpStatus.CREATED)
  createQuote(@Body() dto: CreateInquiryDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
    return this.inquiriesService.createInquiry(dto, 'QUOTE', userAgent, ipAddress);
  }

  @Post('public/product')
  @HttpCode(HttpStatus.CREATED)
  createProductInquiry(@Body() dto: CreateInquiryDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
    return this.inquiriesService.createInquiry(dto, 'PRODUCT', userAgent, ipAddress);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminInquiries() {
    return this.inquiriesService.getAdminInquiries();
  }
}
