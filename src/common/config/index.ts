import { z } from 'zod';

import {
  AuthorizationConfig,
  authorizationConfig,
  authorizationEnvSchema
} from './authorization.config';
import { CommonConfig, commonConfig, commonEnvSchema } from './common.config';
import {
  DatabaseConfig,
  databaseConfig,
  databaseEnvSchema
} from './database.config';
import {
  MachineToMachineConfig,
  machineToMachineConfig,
  machineToMachineEnvSchema
} from './machine-to-machine.config';
import { S3Config, s3Config, s3EnvSchema } from './s3.config';

const environmentSchema = commonEnvSchema
  .merge(databaseEnvSchema)
  .merge(authorizationEnvSchema)
  .merge(machineToMachineEnvSchema)
  .merge(s3EnvSchema);

export const configuration = [
  commonConfig,
  databaseConfig,
  authorizationConfig,
  machineToMachineConfig,
  s3Config
];

export type Config = {
  common: CommonConfig;
  database: DatabaseConfig;
  auth: AuthorizationConfig;
  m2m: MachineToMachineConfig;
  s3: S3Config;
};

export const validate = (
  env: NodeJS.ProcessEnv
): z.infer<typeof environmentSchema> => environmentSchema.parse(env);

export {
  CommonConfig,
  DatabaseConfig,
  AuthorizationConfig,
  MachineToMachineConfig,
  S3Config
};
