import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
@UseGuards(AuthGuard('bearer'))
export class UsersController {
  @Get('/profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}