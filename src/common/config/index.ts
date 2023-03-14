import { z } from 'zod';

import { CommonConfig, commonConfig, commonEnvSchema } from './common.config';
import { DatabaseConfig, databaseConfig, databaseEnvSchema } from './database.config';
import { LogtoConfig, logtoConfig, logtoEnvSchema } from './logto.config';

const environmentSchema = commonEnvSchema.merge(databaseEnvSchema).merge(logtoEnvSchema);

export const configuration = [commonConfig, databaseConfig, logtoConfig];

export type Config = {
  common: CommonConfig;
  database: DatabaseConfig;
  logto: LogtoConfig;
};

export const validate = (env: NodeJS.ProcessEnv): z.infer<typeof environmentSchema> => environmentSchema.parse(env);

export { CommonConfig, DatabaseConfig, LogtoConfig };
