import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const commonEnvSchema = z.object({
  TEST: z
    .literal('false')
    .or(z.literal('true'))
    .default('false'),
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000)
});

export type CommonConfig = {
  isTest: boolean;
  environment: string;
  port: number;
  cors: CorsOptions;
};

export const commonConfig = registerAs('common', (): CommonConfig => {
  const corsOrigins = Object.entries(process.env)
    .filter(([key]) => key.startsWith('CORS_'))
    .map(([, value]) => value);

  return {
    isTest: process.env.TEST.toLowerCase() === 'true',
    environment: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    cors: {
      origin: corsOrigins
    }
  };
});
