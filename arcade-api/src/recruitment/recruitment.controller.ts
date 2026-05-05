import { Controller, Post, Get, Put, Delete, Body, Param, Ip, Query, UseGuards, Req } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Post('public/jobs')
  async applyJob(@Body() body: any, @Ip() ip: string, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    return this.recruitmentService.createJobApplication(body, ip, userAgent);
  }

  @Post('public/franchise')
  async applyFranchise(@Body() body: any, @Ip() ip: string, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    return this.recruitmentService.createFranchiseApplication(body, ip, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/jobs')
  async getJobs() {
    return this.recruitmentService.getJobApplications();
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/jobs/:id/status')
  async updateJobStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.recruitmentService.updateJobStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/franchise')
  async getFranchise() {
    return this.recruitmentService.getFranchiseApplications();
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/franchise/:id/status')
  async updateFranchiseStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.recruitmentService.updateFranchiseStatus(id, status);
  }

  @Get('public/postings')
  async getPublicJobPostings(@Query('locale') locale: string) {
    return this.recruitmentService.getPublicJobPostings(locale);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/postings')
  async getAdminJobPostings() {
    return this.recruitmentService.getAdminJobPostings();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/postings/:id')
  async getAdminJobPosting(@Param('id') id: string) {
    return this.recruitmentService.getAdminJobPosting(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/postings')
  async createJobPosting(@Body() body: any) {
    return this.recruitmentService.createJobPosting(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/postings/:id')
  async updateJobPosting(@Param('id') id: string, @Body() body: any) {
    return this.recruitmentService.updateJobPosting(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/postings/:id')
  async deleteJobPosting(@Param('id') id: string) {
    return this.recruitmentService.deleteJobPosting(id);
  }
}
