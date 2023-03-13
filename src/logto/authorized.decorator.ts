import {
  applyDecorators,
  ForbiddenException,
  SetMetadata,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiExceptionFix } from 'common/api-exception-class.decorator';

import { JwtGuard } from './guards/jwt.guard';
import { ScopeGuard } from './guards/scope.guard';

export const Authorized = (
  ...scopes: string[]
): ClassDecorator & MethodDecorator => {
  const decorators = [
    UseGuards(JwtGuard),
    SetMetadata('scopes', scopes),
    UseGuards(ScopeGuard),
    ApiBearerAuth(),
    ApiExceptionFix(() => new UnauthorizedException('UNAUTHORIZED'), {
      description: 'Не был передан access token.'
    })
  ];

  if (scopes.length > 0) {
    decorators.push(
      ApiExceptionFix(() => new ForbiddenException('FORBIDDEN'), {
        description: 'Недостаточно прав.'
      })
    );
  }

  return applyDecorators(...decorators);
};
