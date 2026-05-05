import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  // Native CSV escape function to prevent comma/quote breakage
  private escapeCsv(field: any): string {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  async generateLeadsCsv(): Promise<string> {
    const leads = await this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: { include: { translations: true } }
      }
    });

    const headers = ['ID', 'Status', 'Inquiry Type', 'Name', 'Email', 'Phone', 'Country', 'Requested Qty', 'Campaign Tag', 'Created At'];
    
    const rows = leads.map(lead => [
      lead.id,
      lead.status,
      lead.inquiryType,
      lead.contactName || '',
      lead.contactEmail || '',
      lead.contactPhone || '',
      lead.countryCode || '',
      lead.requestedQuantity || '',
      lead.utmCampaign || '',
      lead.createdAt.toISOString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(f => this.escapeCsv(f)).join(','))
      .join('\n');

    return csvContent;
  }

  async generateCustomersCsv(): Promise<string> {
    const customers = await this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { contacts: true }
    });

    const headers = ['Customer ID', 'Company Name', 'Primary Contact', 'Primary Email', 'Country', 'Total Inquiries', 'Joined Date'];

    const rows = await Promise.all(customers.map(async custom => {
      const primaryContact = custom.contacts.find(c => c.isPrimary) || custom.contacts[0];
      const inquiryCount = await this.prisma.inquiry.count({ where: { customerId: custom.id }});
      return [
        custom.id,
        custom.companyName || '',
        primaryContact?.fullName || '',
        primaryContact?.email || '',
        custom.countryCode || '',
        inquiryCount,
        custom.createdAt.toISOString()
      ];
    }));

    const csvContent = [headers, ...rows]
      .map(row => row.map(f => this.escapeCsv(f)).join(','))
      .join('\n');

    return csvContent;
  }

  async generateProductsCsv(): Promise<string> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { translations: true }
    });

    const headers = ['Product ID', 'SKU', 'Slug', 'Status', 'Product Name', 'Voltage', 'Lead Time Days', 'MOQ'];

    const rows = products.map(product => [
      product.id,
      product.sku || '',
      product.slug,
      product.status,
      product.translations[0]?.name || '',
      product.voltage || '',
      product.leadTimeDays || '',
      product.moq || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(f => this.escapeCsv(f)).join(','))
      .join('\n');

    return csvContent;
  }
}
