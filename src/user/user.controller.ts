// src/user/user.controller.ts
import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @Post('createUser')
  // async createUser(
  //   @Query('username') username: string,
  //   @Query('password') password: string,
  // ): Promise<User> {
  //   return this.userService.createUser(username, password);
  // }
  // @Get(':username')
  // async findUser(@Param('username') username: string): Promise<User> {
  //   return this.userService.findUser(username);
  // }

  @Get('getUsersMessages')
  async getUser(@Query('sender') sender: string,
    @Query('receiver') receiver: string,) {
    return this.userService.getusersMessages(sender, receiver);
  }

  @Post('sendMessages')
  async sendMessages(
    @Query('message') message: string,
    @Query('sender') sender: string,
    @Query('receiver') receiver: string,
  ): Promise<User> {
    return this.userService.SendUsersMessages(message, sender, receiver);
  }


  @Get('recentMessages')
  async recentMessages(

    @Query('sender') sender: string,
    
  ): Promise<User> {
    return this.userService.getRecentChatsOfUsers(sender);
  }

  @Get('filterUsers')
  async filterUsers(@Query('id') username:string):Promise<any>{

    return this.userService.filterRegisteredUsers(username);
  }
}
