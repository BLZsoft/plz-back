import { LogtoConfig } from 'config/logto.config';

import { TokenPayload } from './token-payload';

export const getTestToken = (logtoConfig: LogtoConfig): TokenPayload => ({
  jti: 'token-id',
  sub: 'jV3qUCnZHTkw',
  iat: Math.ceil(Date.now() / 1000),
  exp: Math.ceil((Date.now() + 3_600_000) / 1000),
  scope: 'read:resource write:resource',
  client_id: 'test-application',
  iss: logtoConfig.issuer,
  aud: logtoConfig.audience
});
