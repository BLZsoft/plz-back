import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { z } from 'zod';

export const logtoEnvSchema = z.object({
  LOGTO_URL: z.string().url(),
  LOGTO_AUDIENCE: z.string().url()
});

export type LogtoConfig = {
  jwksUri: URL;
  issuer: string;
  audience: string;
};

export const logtoConfig = registerAs(
  'logto',
  (): LogtoConfig => ({
    jwksUri: new URL(process.env.LOGTO_URL + '/oidc/jwks'),
    issuer: process.env.LOGTO_URL + '/oidc',
    audience: process.env.LOGTO_AUDIENCE
  })
);
