import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { configuration, validate } from 'common/config';
import { ObjectsModule } from 'objects/objects.module';
import { ProfileModule } from 'profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validate
    }),
    PrismaModule.forRoot(),
    ObjectsModule,
    ProfileModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
