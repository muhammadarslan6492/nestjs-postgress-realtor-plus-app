import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignupDto) {
    try {
      return this.authService.signup(body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    try {
      return this.authService.signin(body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
