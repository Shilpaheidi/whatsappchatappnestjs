import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
// import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import  { dataSourceConfig, typeOrmConfig } from './config/db.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    ChatModule,
    // FirebaseModule,
    AuthModule,
    UsersModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: '.env',
    // })
  ],
})
export class AppModule {}

export const dbConnection = new DataSource(dataSourceConfig);
dbConnection
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
