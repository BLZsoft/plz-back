import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { z } from 'zod';

export const swaggerEnvSchema = z.object({
  SWAGGER_CLIENT_ID: z.string(),
  SWAGGER_CLIENT_SECRET: z.string()
});

export type SwaggerConfig = {
  scopes: string[];
  clientId: string;
  clientSecret: string;
};

export const swaggerConfig = registerAs(
  'swagger',
  (): SwaggerConfig => ({
    scopes: ['openid', 'offline_access', 'profile'],
    clientId: process.env.SWAGGER_CLIENT_ID,
    clientSecret: process.env.SWAGGER_CLIENT_SECRET
  })
);
