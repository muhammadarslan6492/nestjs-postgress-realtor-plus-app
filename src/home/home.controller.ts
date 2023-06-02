import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  InternalServerErrorException,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';

import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homseService: HomeService) {}
  @Get()
  getHomes() {
    return this.homseService.homse();
  }

  @Get(':id')
  getHome() {
    return {};
  }

  @Post()
  createHome() {
    return {};
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
