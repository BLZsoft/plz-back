import { AwsCredentialIdentity } from '@aws-sdk/types';
import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { z } from 'zod';

export const s3EnvSchema = z.object({
  S3_ENDPOINT: z.string().url(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_REGION: z.string(),
  S3_AVATARS_BUCKET: z.string()
});

export type S3Config = {
  endpoint: string;
  credentials: AwsCredentialIdentity;
  region: string;
  buckets: {
    avatars: string;
  };
};

export const s3Config = registerAs(
  's3',
  (): S3Config => ({
    endpoint: new URL(process.env.S3_ENDPOINT).href,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY
    },
    region: process.env.S3_REGION,
    buckets: {
      avatars: process.env.S3_AVATARS_BUCKET
    }
  })
);
