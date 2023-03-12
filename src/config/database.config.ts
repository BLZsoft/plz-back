import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().startsWith('postgresql://')
});

export type DatabaseConfig = {
  url: string;
};

export const databaseConfig = registerAs(
  'database',
  (): DatabaseConfig => ({
    url: process.env.DATABASE_URL
  })
);
