import { IsOptional, IsString, IsEnum } from 'class-validator';
import { LeadStatus } from '@prisma/client';

export class UpdateLeadDto {
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsString()
  @IsOptional()
  assignedAdminId?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
