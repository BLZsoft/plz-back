import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';

@Module({
  controllers: [ObjectsController],
  providers: [ObjectsService, PrismaService]
})
export class ObjectsModule {}
