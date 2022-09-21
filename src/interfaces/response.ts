import type { Context } from '../core/context';

export interface EviateResponse {
  status?: Number;
  text?: string;
  json?: {};
  error?: Error | string | {};
  headers?: {};
  interface?: any;
  Blob?: Blob;
  ctx?: Context;
}
