import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Config } from 'common/config';

export const initializeSwagger = (app: NestExpressApplication): void => {
  const configService = app.get<ConfigService<Config>>(ConfigService);
  const commonConfig = configService.getOrThrow('common');

  const swaggerDocumentBuilder = new DocumentBuilder()
    .setTitle('пожликбез.рф API')
    .setDescription('API спецификация пожликбез.рф')
    .setVersion('1.0')
    .setContact('evist0', '', 'danil.tankoff@yandex.ru');

  if (!commonConfig.isTest) {
    swaggerDocumentBuilder.addBearerAuth();
  }

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentBuilder.build()
  );

  SwaggerModule.setup('', app, swaggerDocument, {
    useGlobalPrefix: true,
    jsonDocumentUrl: 'swagger.json',
    yamlDocumentUrl: 'swagger.yaml'
  });
};
