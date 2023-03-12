import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const commonEnvSchema = z.object({
  NODE_ENV: z.string().default('test'),
  PORT: z.string().regex(/^\d+$/).default('3000')
});

export type CommonConfig = {
  environment: string;
  testJwt?: string;
  port: number;
};

export const commonConfig = registerAs(
  'common',
  (): CommonConfig => ({
    environment: process.env.NODE_ENV,
    testJwt: process.env.NODE_ENV === 'test' ? 'secret' : undefined,
    port: parseInt(process.env.PORT, 10)
  })
);
