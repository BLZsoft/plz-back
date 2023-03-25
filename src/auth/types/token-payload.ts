import { RawPayload } from './jose';

export type TokenPayload = Omit<RawPayload, 'scope'> & { scopes: string[] };
