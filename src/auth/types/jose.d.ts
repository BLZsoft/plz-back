export interface RawPayload {
  jti: string;
  sub: string;
  iat: number;
  exp: number;
  scope?: string;
  client_id: string;
  iss: string;
  aud: string;
}

declare module 'jose' {
  export interface JWTPayload extends RawPayload {}
}
