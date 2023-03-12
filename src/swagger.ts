import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';

import { LogtoConfig } from 'config/logto.config';
import { SwaggerConfig } from 'config/swagger.config';

export const initializeSwagger = (app: NestExpressApplication): void => {
  const config = app.get(ConfigService);

  const logtoConfig = config.get<LogtoConfig>('logto');
  const swaggerConfig = config.get<SwaggerConfig>('swagger');

  const swaggerDocumentConfig = new DocumentBuilder()
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: logtoConfig.authUrl,
          tokenUrl: logtoConfig.tokenUrl,
          refreshUrl: logtoConfig.tokenUrl,
          scopes: swaggerConfig.scopes.reduce(
            (acc, scope) => ({ ...acc, [scope]: '' }),
            {}
          )
        }
      }
    })
    .setTitle('Пожликбез API')
    .setDescription('API спецификация пожликбез.рф')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentConfig
  );

  const expressApp = app.getHttpAdapter();

  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url === '/api') {
      return res.redirect('/api/');
    }

    return next();
  });

  SwaggerModule.setup('', app, swaggerDocument, {
    useGlobalPrefix: true,
    swaggerOptions: {
      initOAuth: {
        usePkceWithAuthorizationCodeGrant: true,
        clientId: swaggerConfig.clientId,
        clientSecret: swaggerConfig.clientSecret,
        scopes: swaggerConfig.scopes
      }
    }
  });
};
