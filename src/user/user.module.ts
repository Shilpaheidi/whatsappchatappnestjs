import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController], // Export UserService if used in other modules
})
export class UserModule {}
