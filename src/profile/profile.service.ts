import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from 'nestjs-http-promise';

import { AuthService } from 'auth';
import { Config, S3Config } from 'common/config';

import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  private readonly s3Config: S3Config;
  private readonly s3: S3;

  constructor(
    configService: ConfigService<Config>,
    private readonly authService: AuthService,
    private readonly httpService: HttpService
  ) {
    this.s3Config = configService.getOrThrow<S3Config>('s3');

    this.s3 = new S3(this.s3Config);
  }

  async update(
    userId: string,
    payload: UpdateProfileDto,
    file: Express.Multer.File
  ): Promise<void> {
    if (file) {
      await this.s3.putObject({
        Bucket: this.s3Config.buckets.avatars,
        Key: userId,
        ContentType: file.mimetype,
        Body: file.buffer
      });

      payload.avatar =
        this.s3Config.endpoint + `${this.s3Config.buckets.avatars}/${userId}`;
    }

    const accessToken = await this.authService.getToken();

    console.log(payload);

    await this.httpService.patch(`/api/users/${userId}`, payload, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  }
}
