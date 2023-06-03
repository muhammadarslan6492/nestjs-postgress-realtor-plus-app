import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { HomeController } from './home.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HomeService } from './home.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Utils } from 'src/utils';

@Module({
  imports: [PrismaModule],
  controllers: [HomeController],
  providers: [
    HomeService,
    Utils,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class HomeModule {}
