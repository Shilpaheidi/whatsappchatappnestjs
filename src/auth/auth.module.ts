import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule,UserModule], // import Passport module
  providers: [FirebaseAuthStrategy,], // provide our strategy
  controllers: [AuthController],
})
export class AuthModule {}