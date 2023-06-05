import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Query,
  Body,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';

import { HomeResponseDto, CreateHomeDto, UpdateHomeDto } from './dto/home.dto';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { HomeService } from './home.service';
import { PropertyType, UserType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homseService: HomeService) {}
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    try {
      const price =
        minPrice || maxPrice
          ? {
              ...(minPrice && { gte: parseFloat(minPrice) }),
              ...(maxPrice && { gte: parseFloat(maxPrice) }),
            }
          : undefined;

      const filters = {
        ...(city && { city }),
        ...(price && { price }),
        ...(propertyType && { propertyType }),
      };

      return this.homseService.homse(filters);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.homseService.getHome(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
    try {
      console.log('this is user', user);
      return this.homseService.createHome(body, user.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInfo,
  ) {
    try {
      const realtor = await this.homseService.getRealtorByHomeId(id);
      if (realtor.id !== user.id) {
        throw new UnauthorizedException();
      }
      return this.homseService.updateHome(id, body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    try {
      const realtor = await this.homseService.getRealtorByHomeId(id);
      if (realtor.id !== user.id) {
        throw new UnauthorizedException();
      }
      return this.homseService.deleteHome(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
