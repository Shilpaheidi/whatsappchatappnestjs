import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async saveMessage(message: string, user: User): Promise<Chat> {
    const chat = this.chatRepository.create({ message, user });
    return this.chatRepository.save(chat);
  }

  async getMessages(): Promise<Chat[]> {
    return this.chatRepository.find({ relations: ['user'] });
  }
}
