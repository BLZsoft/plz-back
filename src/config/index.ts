import { z } from 'zod';

import { commonConfig, commonEnvSchema } from './common.config';
import { databaseConfig, databaseEnvSchema } from './database.config';
import { logtoConfig, logtoEnvSchema } from './logto.config';

const environmentSchema = commonEnvSchema
  .merge(databaseEnvSchema)
  .merge(logtoEnvSchema);

type Environment = z.infer<typeof environmentSchema>;

export const configuration = [commonConfig, databaseConfig, logtoConfig];

export const validate = (env: Record<string, unknown>): Environment =>
  environmentSchema.parse(env);
