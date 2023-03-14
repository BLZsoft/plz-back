import { RawPayload } from './jose';
import { Scope } from '../auth.consts';

export type TokenPayload = Omit<RawPayload, 'scope'> & { scopes: Scope[] };
