import { Controller, Get, Param, Put, Body, Post, UseGuards, Request } from '@nestjs/common';
import { CrmService } from './crm.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/crm/leads')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get()
  getLeads() {
    return this.crmService.getLeads();
  }

  @Get(':id')
  getLeadDetail(@Param('id') id: string) {
    return this.crmService.getLeadDetail(id);
  }

  @Put(':id')
  updateLead(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
    @Request() req: any,
  ) {
    return this.crmService.updateLead(id, dto, req.user.id);
  }

  @Post(':id/notes')
  addNote(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @Request() req: any,
  ) {
    return this.crmService.addNote(id, notes, req.user.id);
  }
}
