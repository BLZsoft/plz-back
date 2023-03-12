import { commonConfig, commonEnvSchema } from './common.config';
import { databaseConfig, databaseEnvSchema } from './database.config';
import { logtoConfig, logtoEnvSchema } from './logto.config';
import { swaggerConfig, swaggerEnvSchema } from './swagger.config';

const environmentSchema = commonEnvSchema
  .merge(swaggerEnvSchema)
  .merge(databaseEnvSchema)
  .merge(logtoEnvSchema);

export const configuration = [
  commonConfig,
  swaggerConfig,
  databaseConfig,
  logtoConfig
];

export const validate = (env: Record<string, unknown>): unknown =>
  environmentSchema.parse(env);
