import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import { SignupParams, SignupResponse, SigninParams } from './auth.interface';

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
      throw new ConflictException('User all ready exist');
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
      message: 'user successfully created',
      user: {
        id: user.id,
      },
    };

    return response;
  }

  async signin({ email, password }: SigninParams) {}
}
