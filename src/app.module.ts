import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { ObjectsModule } from 'objects/objects.module';

@Module({
  imports: [PrismaModule.forRoot(), ObjectsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
