import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @UseGuards(JwtAuthGuard)
  @Get('admin/leads')
  async exportLeads(@Res() res: Response) {
    const csvContent = await this.exportService.generateLeadsCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment(`arcade_leads_${new Date().getTime()}.csv`);
    return res.send(csvContent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/customers')
  async exportCustomers(@Res() res: Response) {
    const csvContent = await this.exportService.generateCustomersCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment(`arcade_customers_${new Date().getTime()}.csv`);
    return res.send(csvContent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/products')
  async exportProducts(@Res() res: Response) {
    const csvContent = await this.exportService.generateProductsCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment(`arcade_products_${new Date().getTime()}.csv`);
    return res.send(csvContent);
  }
}
