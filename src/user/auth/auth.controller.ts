import {
  Controller,
  Post,
  Body,
  Get,
  InternalServerErrorException,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto, GenerateProductKeyDto } from '../dto/auth.dto';
import { UserType } from '@prisma/client';
import { User, UserInfo } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    try {
      if (userType !== UserType.BUYER) {
        if (!body.productKey) {
          throw new UnauthorizedException();
        }
        const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY}`;
        const isValidKey = await bcrypt.compare(
          validProductKey,
          body.productKey,
        );
        if (!isValidKey) {
          throw new UnauthorizedException();
        }
      }
      return this.authService.signup(body, userType);
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

  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDto) {
    try {
      return this.authService.generateProductKey(email, userType);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/me')
  me(@User() user: UserInfo) {
    return user;
  }
}
