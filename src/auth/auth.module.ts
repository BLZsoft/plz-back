import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from 'nestjs-http-promise';

import { AuthService } from './auth.service';
import { JWT_STRATEGY, JwtGuard } from './guards/jwt.guard';
import { ScopeGuard } from './guards/scope.guard';
import { JwtGuardStrategy } from './guards/strategies/jwt-guard.strategy';
import { TestJwtGuardStrategy } from './guards/strategies/test-jwt-guard.strategy';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: 3_000,
        retries: 3,
        baseURL: configService.getOrThrow('m2m.baseUrl')
      })
    })
  ],
  providers: [
    AuthService,
    {
      provide: JWT_STRATEGY,
      useFactory: (
        configService: ConfigService
      ): TestJwtGuardStrategy | JwtGuardStrategy =>
        configService.get<boolean>('common.isTest')
          ? new TestJwtGuardStrategy(configService)
          : new JwtGuardStrategy(configService),
      inject: [ConfigService]
    },
    JwtGuard,
    ScopeGuard
  ],
  exports: [AuthService, JWT_STRATEGY, JwtGuard, ScopeGuard]
})
export class AuthModule {}
