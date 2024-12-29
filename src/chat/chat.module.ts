import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module'; // Import UserModule
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    UserModule, // Add UserModule to imports
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
