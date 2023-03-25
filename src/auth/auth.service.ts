import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from 'nestjs-http-promise';

import { Config, MachineToMachineConfig } from 'common/config';

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

@Injectable()
export class AuthService {
  private m2mConfig: MachineToMachineConfig;

  constructor(
    configService: ConfigService<Config>,
    private readonly httpService: HttpService
  ) {
    this.m2mConfig = configService.getOrThrow<MachineToMachineConfig>('m2m');
  }

  async getToken(): Promise<string> {
    const auth = Buffer.from(
      this.m2mConfig.clientId + ':' + this.m2mConfig.clientSecret
    ).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('resource', this.m2mConfig.resource);
    params.append('scope', this.m2mConfig.scope);

    const response = await this.httpService.post<TokenResponse>(
      '/oidc/token',
      params,
      {
        headers: {
          Authorization: 'Basic ' + auth
        }
      }
    );

    return response.data.access_token;
  }
}
