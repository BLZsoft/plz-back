import {
  applyDecorators,
  SetMetadata,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

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
    ApiBearerAuth('logtoJwt'),
    ApiExceptionClass(() => UnauthorizedException, {
      description: 'Не был передан access token.'
    })
  );
