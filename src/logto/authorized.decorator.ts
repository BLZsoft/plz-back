import {
  applyDecorators,
  SetMetadata,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiOAuth2 } from '@nestjs/swagger';

import { ApiExceptionClass } from 'common/api-exception-class.decorator';

import { JwtGuard } from './guards/jwt.guard';
import { ScopeGuard } from './guards/scope.guard';

export const Authorized = (
  ...scopes: string[]
): ClassDecorator & MethodDecorator =>
  applyDecorators(
    UseGuards(JwtGuard),
    SetMetadata('scopes', scopes),
    UseGuards(ScopeGuard),
    ApiOAuth2(scopes),
    ApiExceptionClass(() => UnauthorizedException, {
      description: 'Не был передан access token.'
    })
  );
