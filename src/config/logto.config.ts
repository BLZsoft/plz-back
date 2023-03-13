import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const logtoEnvSchema = z.object({
  LOGTO_URL: z.string().url(),
  LOGTO_AUDIENCE: z.string().url(),
  LOGTO_ISSUER_ENDPOINT: z.string().default('/oidc'),
  LOGTO_JWKS_ENDPOINT: z.string().default('/oidc/jwks')
});

export type LogtoConfig = {
  issuer: string;
  audience: string;
  jwksUrl: URL;
};

export const logtoConfig = registerAs(
  'logto',
  (): LogtoConfig => ({
    issuer: new URL(process.env.LOGTO_URL + process.env.LOGTO_ISSUER_ENDPOINT)
      .href,
    audience: process.env.LOGTO_AUDIENCE,
    jwksUrl: new URL(process.env.LOGTO_URL + process.env.LOGTO_JWKS_ENDPOINT)
  })
);
