import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomGateway } from './realtime/room.gateway';
import { PrismaService } from './prisma/prisma.service';
import { InterviewModule } from './interview/interview.module';

@Module({
  imports: [InterviewModule],
  controllers: [AppController],
  providers: [AppService, RoomGateway, PrismaService],
})
export class AppModule {}
