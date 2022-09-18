import type { Context } from '../core/context';

export interface response {
  status?: Number;
  text?: string;
  json?: {};
  error?: Error | string | {};
  headers?: {};
  interface?: any;
  Blob?: Blob;
  ctx?: Context;
}
