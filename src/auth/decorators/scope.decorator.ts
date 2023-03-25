import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { applyDecorators, ForbiddenException, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOAuth2 } from '@nestjs/swagger';

import { ScopeGuard } from '../guards/scope.guard';

const META_KEY = 'scoopes';

export const Scope = (...scopes: string[]): ClassDecorator & MethodDecorator => {
  const decorators = [
    SetMetadata(META_KEY, scopes),
    ApiOAuth2(scopes),
    UseGuards(ScopeGuard)
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
