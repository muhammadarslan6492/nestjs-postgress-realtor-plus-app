import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Utils } from 'src/utils';

@Module({
  imports: [PrismaModule],
  controllers: [HomeController],
  providers: [HomeService, Utils],
})
export class HomeModule {}
