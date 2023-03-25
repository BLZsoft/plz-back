import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const machineToMachineEnvSchema = z.object({
  M2M_BASE_URL: z.string(),
  M2M_CLIENT_ID: z.string(),
  M2M_CLIENT_SECRET: z.string(),
  M2M_RESOURCE: z.string().default('https://default.logto.app/api'),
  M2M_SCOPE: z.string().default('all')
});

export type MachineToMachineConfig = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  resource: string;
  scope: string;
};

export const machineToMachineConfig = registerAs(
  'm2m',
  (): MachineToMachineConfig => ({
    baseUrl: process.env.M2M_BASE_URL,
    clientId: process.env.M2M_CLIENT_ID,
    clientSecret: process.env.M2M_CLIENT_SECRET,
    resource: process.env.M2M_RESOURCE,
    scope: process.env.M2M_SCOPE
  })
);
