import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from 'app.module';
import { Config } from 'common/config';

import { initializeSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }]
  });

  const config = app.get<ConfigService<Config>>(ConfigService);
  const commonConfig = config.get('common');

  app.enableCors(commonConfig.cors);
  initializeSwagger(app);

  await app.listen(commonConfig.port);
}

bootstrap();
