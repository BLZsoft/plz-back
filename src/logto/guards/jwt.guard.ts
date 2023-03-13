import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { CommonConfig } from 'config/common.config';
import { LogtoConfig } from 'config/logto.config';

import { getTestToken } from '../logto.consts';
import { TokenPayload } from '../token-payload';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logtoConfig: LogtoConfig;
  private readonly commonConfig: CommonConfig;

  constructor(private readonly configService: ConfigService) {
    this.commonConfig = configService.get<CommonConfig>('common');
    this.logtoConfig = configService.get<LogtoConfig>('logto');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (this.commonConfig.testToken) {
      request.token = getTestToken(this.logtoConfig);
      return true;
    }

    try {
      const token = this.getToken(request);

      const { payload } = await jwtVerify(
        token,
        createRemoteJWKSet(this.logtoConfig.jwksUrl),
        {
          issuer: this.logtoConfig.issuer,
          audience: this.logtoConfig.audience
        }
      );

      request.token = payload as TokenPayload;

      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private getToken(request: Request): string {
    const authorization = request.get('Authorization');

    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }

    const [, token] = authorization.split(' ');

    return token;
  }
}
