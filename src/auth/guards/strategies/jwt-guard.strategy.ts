import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { Config, LogtoConfig } from 'common/config';

export class JwtGuardStrategy implements CanActivate {
  private readonly logtoConfig: LogtoConfig;

  constructor(configService: ConfigService<Config>) {
    this.logtoConfig = configService.get('logto');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    try {
      const token = this.getToken(request);

      const { payload } = await jwtVerify(token, createRemoteJWKSet(this.logtoConfig.jwksUrl), {
        issuer: this.logtoConfig.issuer,
        audience: this.logtoConfig.audience
      });

      request.token = {
        ...payload,
        scopes: payload.scope?.split(' ')
      };

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
