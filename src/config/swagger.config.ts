import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { z } from 'zod';

export const swaggerEnvSchema = z.object({
  SWAGGER_CLIENT_ID: z.string(),
  SWAGGER_CLIENT_SECRET: z.string(),
  SWAGGER_AUTHORIZATION_URL: z.string().url(),
  SWAGGER_TOKEN_URL: z.string().url()
});

export type SwaggerConfig = {
  oauth2name: string;
  scopes: string[];
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
};

export const swaggerConfig = registerAs(
  'swagger',
  (): SwaggerConfig => ({
    oauth2name: 'logto',
    scopes: ['openid', 'offline_access', 'profile'],
    clientId: process.env.SWAGGER_CLIENT_ID,
    clientSecret: process.env.SWAGGER_CLIENT_SECRET,
    authorizationUrl: process.env.SWAGGER_AUTHORIZATION_URL,
    tokenUrl: process.env.SWAGGER_TOKEN_URL
  })
);
