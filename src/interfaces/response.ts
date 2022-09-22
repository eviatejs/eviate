import type { Context } from '../core/context';

export interface EviateResponse {
  status?: number;
  text?: string;
  json?: {};
  error?: Error | string | {};
  headers?: { [key: string]: string };
  interface?: any;
  Blob?: Blob;
  ctx?: Context;
}
