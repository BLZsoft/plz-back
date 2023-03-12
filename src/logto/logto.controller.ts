import {
  Controller,
  Next,
  Post,
  Req,
  Res,
  UseInterceptors
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOAuth2, ApiTags } from '@nestjs/swagger';
import type { RequestHandler } from 'express';
import proxy from 'express-http-proxy';

import { LogtoConfig } from 'config/logto.config';
import { SwaggerConfig } from 'config/swagger.config';

import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('logto')
@Controller('logto')
export class LogtoController {
  proxy: RequestHandler;

  swaggerConfig: SwaggerConfig;
  logtoConfig: LogtoConfig;

  constructor(private readonly configService: ConfigService) {
    this.swaggerConfig = this.configService.get<SwaggerConfig>('swagger');
    this.logtoConfig = this.configService.get<LogtoConfig>('logto');

    this.proxy = proxy(this.logtoConfig.tokenUrl, {
      proxyReqPathResolver: () => '/oidc/token'
    });
  }

  @Post('token')
  @UseInterceptors(FilesInterceptor(''))
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    type: RefreshTokenDto
  })
  @ApiOAuth2([])
  create(@Req() req, @Res() res, @Next() next): void {
    delete req.headers['authorization'];

    req.body.client_id = this.swaggerConfig.clientId;
    req.body.grant_type = 'refresh_token';
    req.body.resource = this.logtoConfig.audience;

    return this.proxy(req, res, next);
  }
}
