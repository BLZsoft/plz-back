import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { z } from 'zod';

export const logtoEnvSchema = z.object({
  LOGTO_ISSUER: z.string().url(),
  LOGTO_AUDIENCE: z.string().url(),
  LOGTO_URL: z.string().url(),
  LOGTO_JWKS_ENDPOINT: z.string().default('/oidc/jwks'),
  LOGTO_AUTHORIZATION_ENDPOINT: z.string().default('/oidc/auth'),
  LOGTO_TOKEN_ENDPOINT: z.string().default('/oidc/token')
});

export type LogtoConfig = {
  issuer: string;
  audience: string;
  jwksUrl: URL;
  authUrl: string;
  tokenUrl: string;
};

export const logtoConfig = registerAs(
  'logto',
  (): LogtoConfig => ({
    issuer: process.env.LOGTO_ISSUER,
    audience: process.env.LOGTO_AUDIENCE,
    jwksUrl: new URL(process.env.LOGTO_URL + process.env.LOGTO_JWKS_ENDPOINT),
    authUrl: process.env.LOGTO_URL + process.env.LOGTO_AUTHORIZATION_ENDPOINT,
    tokenUrl: process.env.LOGTO_URL + process.env.LOGTO_TOKEN_ENDPOINT
  })
);
