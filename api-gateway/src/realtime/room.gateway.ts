import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly prisma: PrismaService) {}
  @WebSocketServer()
  server: Server;
  private rooms = new Map<string, { code: string }>();
  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    await client.join(roomId);
    let interview = await this.prisma.interview.findUnique({
      where: { roomId },
    });
    if (!interview) {
      interview = await this.prisma.interview.create({
        data: { roomId },
      });
    }

    const room = this.rooms.get(roomId);
    client.emit('room_state', {
      code: room?.code ?? '',
    });
  }
  @SubscribeMessage('code_change')
  async handleMessage(
    @MessageBody() data: { roomId: string; code: string },
    @ConnectedSocket() client: Socket,
  ) {
    // client.emit('code');
    const { roomId, code } = data;
    const interview = await this.prisma.interview.findUnique({
      where: { roomId },
    });
    if (!interview) return;
    await this.prisma.codeSnapshot.create({
      data: {
        interviewId: interview.id,
        code,
      },
    });
    const room = this.rooms.get(roomId) ?? { code: '' };
    room.code = code;
    this.rooms.set(roomId, room);

    client.to(roomId).emit('code_change', {
      code,
    });
  }
  @SubscribeMessage('ping')
  handlePing(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Ping received', data);
    client.emit('pong', { message: 'Pong from server' });
  }
}
