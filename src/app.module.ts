import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { ObjectsModule } from 'objects/objects.module';

import { configuration, validate } from './config';
import { LogtoModule } from './logto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validate
    }),
    PrismaModule.forRoot(),
    LogtoModule,
    ObjectsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
