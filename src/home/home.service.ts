import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils';
import { HomeResponseDto } from './dto/home.dto';
import { GetHomesParams, CreateHomeParams } from './home.interface';

const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  propertyType: true,
  number_of_bedrooms: true,
  number_of_bathrooms: true,
};

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
        id,
      },
      select: {
        ...homeSelect,
        images: {
          select: {
            url: true,
          },
        },
        realtor: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException();
    }
    return new HomeResponseDto(home);
  }

  async createHome({
    address,
    city,
    numberOfBathrooms,
    numberOfBedrooms,
    propertyType,
    landSize,
    price,
    images,
  }: CreateHomeParams) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city,
        price,
        propertyType,
        land_size: landSize,
        realtor_id: 1,
      },
    });
    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });
    await this.prismaService.image.createMany({ data: homeImages });
    return new HomeResponseDto(home);
  }

  async updateHome() {
    return {};
  }

  async deleteHome() {
    return {};
  }
}
