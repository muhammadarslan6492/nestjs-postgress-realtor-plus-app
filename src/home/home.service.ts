import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils';

@Injectable()
export class HomeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utils: Utils,
  ) {}

  async homse() {
    const homes = await this.prismaService.home.findMany();
    return homes;
  }

  async oneHome() {
    return {};
  }

  async createHome() {
    return {};
  }

  async updateHome() {
    return {};
  }

  async deleteHome() {
    return {};
  }
}
