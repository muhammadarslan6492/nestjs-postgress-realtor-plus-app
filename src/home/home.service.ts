import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils';
import { HomeResponseDto } from './dto/home.dto';
import { GetHomesParams } from './home.interface';

@Injectable()
export class HomeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utils: Utils,
  ) {}

  async homse(filter: GetHomesParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        price: true,
        propertyType: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filter,
    });

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0].url };
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });
  }

  async getHome(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
    });

    if (!home) {
      throw new NotFoundException();
    }
    return new HomeResponseDto(home);
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
