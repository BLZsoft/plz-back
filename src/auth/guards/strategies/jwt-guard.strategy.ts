import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { AuthorizationConfig, Config } from 'common/config';

export class JwtGuardStrategy implements CanActivate {
  private readonly authConfig: AuthorizationConfig;

  constructor(configService: ConfigService<Config>) {
    this.authConfig = configService.getOrThrow<AuthorizationConfig>('auth');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    try {
      const token = this.getToken(request);

      const { payload } = await jwtVerify(
        token,
        createRemoteJWKSet(this.authConfig.jwksUrl),
        {
          issuer: this.authConfig.issuer,
          audience: this.authConfig.audience
        }
      );

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
