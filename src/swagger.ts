import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';

import { CommonConfig } from './config/common.config';

export const initializeSwagger = (app: NestExpressApplication): void => {
  const configService = app.get(ConfigService);
  const commonConfig = configService.get<CommonConfig>('common');

  const swaggerDocumentBuilder = new DocumentBuilder()
    .setTitle('Пожликбез API')
    .setDescription('API спецификация пожликбез.рф')
    .setVersion('1.0');

  if (!commonConfig.testToken) {
    swaggerDocumentBuilder.addBearerAuth();
  }

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentBuilder.build()
  );

  const expressApp = app.getHttpAdapter();

  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url === '/api') {
      return res.redirect('/api/');
    }

    return next();
  });

  SwaggerModule.setup('', app, swaggerDocument, {
    useGlobalPrefix: true
  });
};
