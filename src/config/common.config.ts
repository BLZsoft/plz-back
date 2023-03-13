import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const commonEnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  TEST_TOKEN: z.string().default('false'),
  PORT: z.string().regex(/^\d+$/).default('3000')
});

export type CommonConfig = {
  testToken: boolean;
  environment: string;
  port: number;
};

export const commonConfig = registerAs(
  'common',
  (): CommonConfig => ({
    testToken:
      process.env.TEST_TOKEN === '1' ||
      process.env.TEST_TOKEN?.toLowerCase() === 'true',
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10)
  })
);
