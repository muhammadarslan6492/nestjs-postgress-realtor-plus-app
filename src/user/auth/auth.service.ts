import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  SignupParams,
  SignupResponse,
  SigninParams,
  signinResponse,
} from './auth.interface';
import { ErrorRes, SuccessRes } from '../../utils/constants';
import { Utils } from '../../utils/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utils: Utils,
  ) {}

  async signup(
    { email, password, name, phone }: SignupParams,
    userType: UserType,
  ): Promise<SignupResponse> {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExist) {
      throw new ConflictException(ErrorRes.USER_EXIST);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashPassword,
        user_type: userType,
      },
    });

    const response: SignupResponse = {
      success: true,
      message: SuccessRes.USER_CREATED,
      user: {
        id: user.id,
      },
    };

    return response;
  }

  async signin({ email, password }: SigninParams): Promise<signinResponse> {
    let user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ConflictException(ErrorRes.INVALID_CREDENTIALS);
    }
    const isMatch = await this.utils.comparePassword(password, user.password);
    if (!isMatch) {
      throw new ConflictException(ErrorRes.INVALID_CREDENTIALS);
    }
    user = { ...user };
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    const token = this.utils.generateToken(user);
    const response: signinResponse = {
      success: true,
      message: SuccessRes.LOGIN_SUCCESS,
      user,
      token,
    };
    return response;
  }

  async generateProductKey(email: string, usertype: UserType) {
    const string = `${email}-${usertype}-${process.env.PRODUCT_KEY}`;
    return this.utils.generateHash(string);
  }
}
