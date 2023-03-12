import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from 'app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }]
  });

  const config = app.get(ConfigService);
  const testJwt = config.get<string | undefined>('common.testJwt');

  const swaggerDocumentConfig = new DocumentBuilder()
    .addBearerAuth(undefined, 'logtoJwt')
    .setTitle('Пожликбез API')
    .setDescription('API спецификация пожликбез.рф')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentConfig
  );

  SwaggerModule.setup('/', app, swaggerDocument, {
    useGlobalPrefix: true,
    swaggerOptions: {
      authAction: {
        logtoJwt: {
          name: 'logtoJwt',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          },
          value: testJwt
        }
      }
    }
  });

  const port = config.get<number>('common.port');
  await app.listen(port);
}

bootstrap();
