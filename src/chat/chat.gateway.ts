import { WebSocketGateway, SubscribeMessage, MessageBody, WsException, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service'; // Import UserService
import { Server, Socket } from 'socket.io'; // Import from socket.io
import { UsePipes, ValidationPipe } from '@nestjs/common';

// WebSocket Gateway with Socket.IO integration
@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server; // This is the actual WebSocket server instance

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService, // Inject UserService
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Handling incoming chat messages
  @SubscribeMessage('text-chat')
  @UsePipes(new ValidationPipe()) // Apply validation to the incoming data
  async handleMessage(
    @MessageBody() data: { message: string; username: string; password: string },
    @ConnectedSocket() client: Socket // Corrected to use the right Socket type
  ) {
    console.log('Received message:', data);

    // Emit the message to all clients
    this.server.emit('text-chat', {
      ...data,
      time: new Date().toDateString(),
    });

    // Handle the message with user service (modify as needed)
    const user = await this.userService.SendUsersMessages(data.message, data.username, data.password);

    // You can return a response to the client who sent the message, if needed
    return user;
  }
}
