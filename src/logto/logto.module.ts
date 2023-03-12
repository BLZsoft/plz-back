import { Module } from '@nestjs/common';

import { JwtGuard } from './guards/jwt.guard';
import { ScopeGuard } from './guards/scope.guard';
import { LogtoController } from './logto.controller';

@Module({
  imports: [],
  controllers: [LogtoController],
  providers: [JwtGuard, ScopeGuard],
  exports: [JwtGuard, ScopeGuard]
})
export class LogtoModule {}
