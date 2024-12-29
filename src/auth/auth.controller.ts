import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import * as FirebaseAuth from 'firebase/auth';
import { SignUpDto } from 'src/dto/sign-up.dto';
// import { SignUpDto } from './dto/sign-up.dto';
import { FirebaseError } from '@firebase/app';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
  // @Post('sign-up')
  // async signUp(@Body() { email, password }: SignUpDto) {
  //   const userCredential = await FirebaseAuth.createUserWithEmailAndPassword(
  //     FirebaseAuth.getAuth(),
  //     email,
  //     password,
  //   );

  //   console.log('userCredential',userCredential);

  //   return { idToken: await userCredential.user.getIdToken() };
  //     // if (userCredential) {
  //     //   return 'Hey, you have signed up successfully!'
  //     // }else{
  //     //     return 'Hey, you have already signed up!'
  //     // }
  // }
  constructor(private readonly userService: UserService) {}
  @Post('sign-up')
  async signUp(@Body() { email, password }: SignUpDto) {
    try {
      const userCredential = await FirebaseAuth.createUserWithEmailAndPassword(
        FirebaseAuth.getAuth(),
   
        email,
        password,
      );

      console.log('userCredential', userCredential);



      return {
        success: true,
        message: 'User signed up successfully',
        data: { idToken: await userCredential.user.getIdToken() },
      };
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === 'auth/email-already-in-use'
      ) {
        throw new HttpException(
          {
            success: false,
            message: 'User already exists. Please log in.',
          },
          HttpStatus.CONFLICT, // 409 Conflict
        );
      }

      // Handle other Firebase errors or any unexpected errors
      throw new HttpException(
        {
          success: false,
          message:
            'Unable to complete the sign-up process at this time. Please try again later.',
        },
        HttpStatus.BAD_REQUEST, // 400 Bad Request
      );
    }
  }

  @Post('login')
async login(@Body() { email, password }: SignUpDto) {
  try {
    const userCredential = await FirebaseAuth.signInWithEmailAndPassword(
      FirebaseAuth.getAuth(),
      email,
      password,
    );

    console.log('userCredential', userCredential);

    return {
      success: true,
      message: 'Logged in successfully',
      data: { idToken: await userCredential.user.getIdToken() },
    };
  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging

    if (error instanceof FirebaseError) {
      // Handle specific Firebase errors with appropriate HTTP status codes
      if (error.code === 'auth/wrong-password') {
        throw new HttpException(
          {
            success: false,
            message: 'Invalid password. Please try again.',
          },
          HttpStatus.UNAUTHORIZED, // 401 Unauthorized
        );
      }

      if (error.code === 'auth/user-not-found') {
        throw new HttpException(
          {
            success: false,
            message: 'User not found. Please sign up.',
          },
          HttpStatus.NOT_FOUND, // 404 Not Found
        );
      }

      if (error.code === 'auth/invalid-email') {
        throw new HttpException(
          {
            success: false,
            message: 'Invalid email format.',
          },
          HttpStatus.BAD_REQUEST, // 400 Bad Request
        );
      }

      // Add other specific error codes as needed
    }

    // Handle any other unexpected errors
    throw new HttpException(
      {
        success: false,
        message: 'Unable to complete the login process at this time. Please try again later.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
    );
  }
}

  
@Post('signupusers')
async SignUpUsers(
  @Body() {username, email, password }: SignUpDto
): Promise<any> {

  const insertUser = this.userService.signUpUser({username, email, password});

  return insertUser;
}

@Post('loginusers')
async logInUsers(
  @Query('email') email: string,  @Query('password') password: string,
): Promise<any> {

  const insertUser = this.userService.authenticateUser(email,password);

  return insertUser;
}


}
