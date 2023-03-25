import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const authorizationEnvSchema = z.object({
  AUTH_AUDIENCE: z.string().url(),
  AUTH_ISSUER: z.string(),
  AUTH_JWKS_ENDPOINT: z.string().url()
});

export type AuthorizationConfig = {
  issuer: string;
  audience: string;
  jwksUrl: URL;
};

export const authorizationConfig = registerAs(
  'auth',
  (): AuthorizationConfig => ({
    issuer: new URL(process.env.AUTH_ISSUER).href,
    audience: process.env.LOGTO_AUDIENCE,
    jwksUrl: new URL(process.env.AUTH_JWKS_ENDPOINT)
  })
);
