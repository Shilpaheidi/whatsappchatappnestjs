// src/user/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })  // Ensure it's a varchar and unique
  username: string;

  @Column({ type: 'varchar' })  // Ensure it's a varchar
  password: string;
}
