import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const controllerScopes =
      this.reflector.get<string[]>('scopes', context.getClass()) ?? [];
    const methodScopes =
      this.reflector.get<string[]>('scopes', context.getHandler()) ?? [];

    // Unique merge
    const routeScopes = [...new Set([...controllerScopes, ...methodScopes])];

    const request: Request = context.switchToHttp().getRequest();
    const tokenScopes = request.token?.scope.split(' ');

    if (!routeScopes) {
      return true;
    }

    const hasScope = (): boolean =>
      routeScopes.every((routeScope) => tokenScopes.includes(routeScope));

    return hasScope();
  }
}
