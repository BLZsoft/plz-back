import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import { AuthorizationConfig, Config } from 'common/config';

export class TestJwtGuardStrategy implements CanActivate {
  private readonly authConfig: AuthorizationConfig;

  constructor(configService: ConfigService<Config>) {
    this.authConfig = configService.getOrThrow<AuthorizationConfig>('auth');
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    request.token = {
      jti: 'token-id',
      sub: 'jV3qUCnZHTkw',
      iat: Math.ceil(Date.now() / 1000),
      exp: Math.ceil((Date.now() + 3_600_000) / 1000),
      scopes: ['read:resource', 'write:resource'],
      client_id: 'test-application',
      iss: this.authConfig.issuer,
      aud: this.authConfig.audience
    };

    return true;
  }
}
