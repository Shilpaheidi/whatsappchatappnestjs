// src/chat/chat.controller.ts
import { Controller, Get, Post, Body, Inject,Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { UserService } from '../user/user.service';
// import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query';

@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService, // Inject UserService here
  ) {}

  // @Post('saveMessages')
  // async saveMessage( message: string,username: string ): Promise<Chat> {

  //   const user = await this.userService.findUser(username);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   return this.chatService.saveMessage(message, user);
  // }

  // @Post('saveMessages')
  // async saveMessage(
  //   @Query('message') message: string,
  //   @Query('username') username: string,
  // ): Promise<Chat> {
  //   const user = await this.userService.findUser(username);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   return this.chatService.saveMessage(message, user);
  // }

  @Get()
  async getMessages(): Promise<Chat[]> {
    return this.chatService.getMessages();
  }
}
