import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from 'nestjs-http-promise';

import { AuthModule } from 'auth';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    AuthModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: 3_000,
        retries: 3,
        baseURL: configService.getOrThrow('m2m.baseUrl')
      })
    })
  ],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
