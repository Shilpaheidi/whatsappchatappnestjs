import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DataSourceOptions } from 'typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'host',
  database: process.env.DB_NAME || 'chat_db',
  autoLoadEntities: true,
  synchronize: true,
};



export const dataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'host',
  database: process.env.DB_NAME || 'chat_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
