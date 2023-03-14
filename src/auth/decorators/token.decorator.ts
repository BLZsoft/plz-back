import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { TokenPayload } from '../types/token-payload';

export const Token = createParamDecorator(
  (_, context: ExecutionContext): TokenPayload => {
    const request: Request = context.switchToHttp().getRequest();

    return request.token;
  }
);
