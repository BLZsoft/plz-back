import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from 'app.module';

import { SwaggerConfig } from './config/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }]
  });

  const config = app.get(ConfigService);
  const swaggerConfig = config.get<SwaggerConfig>('swagger');

  const swaggerDocumentConfig = new DocumentBuilder()
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: swaggerConfig.authorizationUrl,
            tokenUrl: swaggerConfig.tokenUrl,
            refreshUrl: swaggerConfig.tokenUrl,
            scopes: swaggerConfig.scopes.reduce(
              (acc, scope) => ({ ...acc, [scope]: '' }),
              {}
            )
          }
        }
      },
      swaggerConfig.oauth2name
    )
    .setBasePath('swagger')
    .setTitle('Пожликбез API')
    .setDescription('API спецификация пожликбез.рф')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentConfig
  );

  SwaggerModule.setup('swagger', app, swaggerDocument, {
    swaggerOptions: {
      initOAuth: {
        usePkceWithAuthorizationCodeGrant: true,
        clientId: swaggerConfig.clientId,
        clientSecret: swaggerConfig.clientSecret,
        scopes: swaggerConfig.scopes
      }
    }
  });

  app.

  const port = config.get<number>('common.port');
  await app.listen(port);
}

bootstrap();
