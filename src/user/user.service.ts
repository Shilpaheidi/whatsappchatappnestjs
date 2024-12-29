import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { dbConnection } from 'src/app.module';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) { }

  // async createUser(username: string, password: string): Promise<User> {
  //   const user = this.userRepository.create({ username, password });
  //   return this.userRepository.save(user);
  // }
  // db='chat_db';
  // async createUser(username: string, password: string): Promise<User> {
  //   // Check if the user already exists
  //   const existingUser = await this.dataSource.query(
  //     `SELECT * FROM ${this.db}.user WHERE username = ?`,
  //     [username]
  //   );

  //   if (existingUser.length > 0) {
  //     // If the user exists, throw a ConflictException
  //     throw new ConflictException('User already exists');
  //   }

  //   // Use SQL to insert the user into the database
  //   await this.dataSource.query(
  //     `INSERT INTO ${this.db}.user (username, password) VALUES (?, ?)`,
  //     [username, password]
  //   );

  //   // Retrieve and return the newly created user
  //   const [user] = await this.dataSource.query(
  //     `SELECT * FROM ${this.db}.user WHERE username = ?`,
  //     [username]
  //   );

  //   return user;
  // }

  // async findUser(username: string): Promise<User | undefined> {
  //   return this.userRepository.findOne({ where: { username } });
  // }

  async getusersMessages(sender: string, receiver: string) {
    try {
      console.log('Connecting to database...');
      // let getMessages:any = await dbConnection.query(`SELECT c.id, c.message, c.created_at
      //   FROM chat_db.chats c
      //   JOIN chat_db.users s ON c.sender_id = s.id
      //   JOIN chat_db.users r ON c.recipient_id = r.id
      //   WHERE (s.username = '${sender}' AND r.username = '${receiver}')
      //      OR (s.username = '${receiver}' AND r.username = '${sender}')
      //   ORDER BY c.created_at ASC;`)
      let getMessages: any = await dbConnection.query(`     SELECT c.id, c.message, c.created_at,s.username,s.id as userId
        FROM chat_db.chats c
        JOIN chat_db.users s ON c.sender_id = s.id
        JOIN chat_db.users r ON c.recipient_id = r.id
        WHERE (s.username = '${sender}' AND r.username = '${receiver}')
           OR (s.username = '${receiver}' AND r.username = '${sender}')
        ORDER BY c.created_at ASC;`)


      return getMessages;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async SendUsersMessages(message: string, sender: string, receiver: string) {
    try {
      console.log('Connecting to database...');

      const sendMsg = await dbConnection.query(`INSERT INTO chat_db.chats (sender_id, recipient_id, message)
SELECT s.id AS sender_id, r.id AS recipient_id, "${message}"
FROM chat_db.users s, chat_db.users r
WHERE s.username = '${sender}'
AND r.username = '${receiver}';`)



      console.log('Query executed, result:', sendMsg);


      let getMessages: any = await dbConnection.query(`SELECT c.id, c.message, c.created_at
FROM chat_db.chats c
JOIN chat_db.users s ON c.sender_id = s.id
JOIN chat_db.users r ON c.recipient_id = r.id
WHERE (s.username = '${sender}' AND r.username = '${receiver}')
   OR (s.username = '${receiver}' AND r.username = '${sender}')
ORDER BY c.created_at ASC;`)



      if (sendMsg) {

        return getMessages
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  //   async signUpUser(body:any){
  //     const InsertUsers = await dbConnection.query(`INSERT INTO chat_db.users (username, email, password)
  // VALUES 
  // (${body.username}, ${body.email}, ${body.password})
  // )`)

  // return InsertUsers;
  //   }

  async signUpUser(body: any) {
    const query = `
    INSERT INTO chat_db.users (username, email, password)
    VALUES (?, ?, ?)
  `;

    const values = [body.username, body.email, body.password];

    try {
      const InsertUsers = await dbConnection.query(query, values);
      return {
        success: true,
        message: 'User signed up successfully',
        data: InsertUsers,
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // MySQL error code for duplicate entry
        return {
          success: false,
          message: 'User already exists',
        };
      }

      // Handle other potential errors
      throw new Error('An error occurred during sign up');
    }
  }


  bcrypt = require('bcrypt');

  // async  signUpUser(body) {
  //   const hashedPassword = await bcrypt.hash(body.password, 10);
  //   const query = `
  //     INSERT INTO chat_db.users (username, email, password)
  //     VALUES (?, ?, ?)
  //   `;
  //   const values = [body.username, body.email, hashedPassword];

  //   try {
  //     await dbConnection.query(query, values);
  //     return { success: true, message: 'User signed up successfully' };
  //   } catch (error) {
  //     if (error.code === 'ER_DUP_ENTRY') {
  //       return { success: false, message: 'User already exists' };
  //     }
  //     throw new Error('An error occurred during sign up');
  //   }
  // }

  async authenticateUser(email: string, password: string) {
    const query = `SELECT * FROM chat_db.users WHERE email = ? AND password = ?`;
    const values = [email, password];

    try {
      const [rows] = await dbConnection.query(query, values);


      console.log('rows', rows);

      // Handle the query result
      if (rows) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User Logged in Successfully!!!',
          data: rows,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User Not Exist!!!',
        };
      }
    } catch (error) {
      throw new HttpException('An error occurred while processing your request.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getRecentChatsOfUsers(senderEmail: any) {
    try {



      let getMessages: any = await dbConnection.query(`
SELECT 
s.id AS sender_id,
    r.id AS receiver_id,
    r.username AS receiver_username, 
    s.username AS sender_username, 
    c.message, 
    c.created_at
FROM chat_db.chats c
JOIN chat_db.users s ON c.sender_id = s.id
JOIN chat_db.users r ON c.recipient_id = r.id
WHERE r.email = '${senderEmail}'
AND c.created_at = (
    SELECT MAX(c2.created_at)
    FROM chat_db.chats c2
    WHERE c2.sender_id = c.sender_id 
    AND c2.recipient_id = c.recipient_id
)
ORDER BY c.created_at DESC;`)



      if (getMessages) {

        return getMessages
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async filterRegisteredUsers( username: string) {
    let users = await dbConnection.query(`SELECT id,username as sender_username,email FROM chat_db.users where  username LIKE  '${username}%';`);


    return users;
  }

}
