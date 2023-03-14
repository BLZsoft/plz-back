import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthModule } from 'auth';

import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';

@Module({
  imports: [AuthModule],
  controllers: [ObjectsController],
  providers: [ObjectsService, PrismaService]
})
export class ObjectsModule {}
