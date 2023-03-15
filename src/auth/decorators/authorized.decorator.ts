import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { applyDecorators, ForbiddenException, SetMetadata, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtGuard } from '../guards/jwt.guard';
import { ScopeGuard } from '../guards/scope.guard';

export const Authorized = (...scopes: string[]): ClassDecorator & MethodDecorator => {
  const decorators = [
    UseGuards(JwtGuard),
    SetMetadata('scopes', scopes),
    UseGuards(ScopeGuard),
    ApiBearerAuth(),
    ApiException(() => new UnauthorizedException('UNAUTHORIZED'), {
      description: 'Не был передан access token.'
    })
  ];

  if (scopes.length > 0) {
    decorators.push(
      ApiException(() => new ForbiddenException('FORBIDDEN'), {
        description: 'Недостаточно прав.'
      })
    );
  }

  return applyDecorators(...decorators);
};
