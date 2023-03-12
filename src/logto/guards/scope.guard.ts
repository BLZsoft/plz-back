import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routeScopes = this.reflector.get<string[]>(
      'scopes',
      context.getHandler()
    );

    const tokenScopes = context.getArgs()[0].user?.scopes;

    if (!routeScopes) {
      return true;
    }

    const hasScope = (): boolean =>
      routeScopes.every((routeScope) => tokenScopes.includes(routeScope));

    return hasScope();
  }
}
