import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { applyDecorators, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Scope } from './scope.decorator';
import { JwtGuard } from '../guards/jwt.guard';

export const Authorized = (...scopes: string[]): ClassDecorator & MethodDecorator =>
  applyDecorators(
    UseGuards(JwtGuard),
    Scope(...scopes),
    ApiBearerAuth(),
    ApiException(() => new UnauthorizedException('UNAUTHORIZED'), {
      description: 'Не был передан access token.'
    })
  );
