import { Module } from '@nestjs/common';

import { JwtGuard } from './guards/jwt.guard';
import { ScopeGuard } from './guards/scope.guard';

@Module({
  imports: [],
  providers: [JwtGuard, ScopeGuard],
  exports: [JwtGuard, ScopeGuard]
})
export class LogtoModule {}
