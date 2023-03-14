import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JWT_STRATEGY, JwtGuard } from './guards/jwt.guard';
import { ScopeGuard } from './guards/scope.guard';
import { JwtGuardStrategy } from './guards/strategies/jwt-guard.strategy';
import { TestJwtGuardStrategy } from './guards/strategies/test-jwt-guard.strategy';

@Module({
  providers: [
    {
      provide: JWT_STRATEGY,
      useFactory: (configService: ConfigService): TestJwtGuardStrategy | JwtGuardStrategy =>
        configService.get('common.isTest')
          ? new TestJwtGuardStrategy(configService)
          : new JwtGuardStrategy(configService),
      inject: [ConfigService]
    },
    JwtGuard,
    ScopeGuard
  ],
  exports: [JWT_STRATEGY, JwtGuard, ScopeGuard]
})
export class AuthModule {}
