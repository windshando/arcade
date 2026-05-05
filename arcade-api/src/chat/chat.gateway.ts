import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const origins = corsOrigin.split(',').map(o => o.trim());

@WebSocketGateway({ cors: { origin: origins.length === 1 ? origins[0] : origins, credentials: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    // Push the current agent status to the connecting client instantly
    if (this.server) {
      const adminSockets = await this.server.in('admins').fetchSockets();
      client.emit('agentStatus', { isOnline: adminSockets.length > 0 });
    }
  }

  async handleDisconnect(client: Socket) {
    // Delay slightly to let socket.io completely remove the disconnected socket from rooms
    setTimeout(async () => {
      if (this.server) {
        const adminSockets = await this.server.in('admins').fetchSockets();
        this.server.emit('agentStatus', { isOnline: adminSockets.length > 0 });
      }
    }, 100);
  }

  @SubscribeMessage('startSession')
  async handleStartSession(
    @MessageBody() data: { deviceInfo: string },
    @ConnectedSocket() client: Socket,
  ) {
    const ip = client.handshake.address;
    const session = await this.chatService.startSession(ip, data.deviceInfo || 'Unknown');
    if (session) {
      client.join(session.id);
    }
    return { event: 'sessionStarted', data: session };
  }

  @SubscribeMessage('setEmail')
  async handleSetEmail(
    @MessageBody() data: { sessionId: string; email: string; name?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const session = await this.chatService.setSessionDetails(data.sessionId, data.email, data.name);
    this.server.to('admins').emit('newSession', session);
    return { event: 'emailSet', data: session };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { sessionId: string; senderType: 'VISITOR' | 'ADMIN'; content: string; senderName?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const msg = await this.chatService.saveMessage(data.sessionId, data.senderType, data.content, undefined, data.senderName);
    
    // Broadcast back to everyone gracefully deduplicating using an array
    const rooms = [data.sessionId];
    if (data.senderType === 'VISITOR') {
      rooms.push('admins');
    }
    
    this.server.to(rooms).emit('newMessage', msg);
    
    return { event: 'messageSent', data: msg };
  }

  @SubscribeMessage('joinAdmin')
  async handleJoinAdmin(
    @MessageBody() data: { sessionId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join('admins');
    if (data?.sessionId) {
      client.join(data.sessionId);
    }
    
    // Broadcast status to everyone that an admin is online
    this.server.emit('agentStatus', { isOnline: true });
  }
}

