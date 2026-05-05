import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  async getSessions() {
    return this.chatService.getActiveSessions();
  }

  @Get('sessions/:id/messages')
  async getSessionMessages(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }
}
