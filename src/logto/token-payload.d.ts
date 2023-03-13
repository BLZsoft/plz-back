export type TokenPayload = {
  jti: string;
  sub: string;
  iat: number;
  exp: number;
  scope: string;
  client_id: string;
  iss: string;
  aud: string;
};

declare global {
  namespace Express {
    export interface Request {
      token?: TokenPayload;
    }
  }
}
