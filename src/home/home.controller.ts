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
} from '@nestjs/common';

import { HomeResponseDto, CreateHomeDto } from './dto/home.dto';

import { HomeService } from './home.service';
import { PropertyType } from '@prisma/client';

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
  createHome(@Body() body: CreateHomeDto) {
    try {
      return this.homseService.createHome(body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':id')
  updateHome() {
    return {};
  }

  @Delete(':id')
  deleteHome() {
    return {};
  }
}
