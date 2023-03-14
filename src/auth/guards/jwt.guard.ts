import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

export const JWT_STRATEGY = Symbol('JWT_STRATEGY');

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject(JWT_STRATEGY) private readonly strategy: CanActivate) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return this.strategy.canActivate(context);
  }
}
