import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Client connected: ', client.id);
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
