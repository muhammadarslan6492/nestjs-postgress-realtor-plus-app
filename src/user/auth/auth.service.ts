import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { SignupParams, SignupResponse, SigninParams } from './auth.interface';
import { ErrorRes, SuccessRes } from '../../utils/constants';
@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({
    email,
    password,
    name,
    phone,
  }: SignupParams): Promise<SignupResponse> {
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
        user_type: UserType.BUYER,
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

  async signin({ email, password }: SigninParams) {
    let user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ConflictException(ErrorRes.INVALID_CREDENTIALS);
    }
    user = { ...user };
    delete user.password;
  }
}
