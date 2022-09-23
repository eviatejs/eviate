import type { Context } from '../core/context';

export interface EviateResponse {
  status?: number;
  text?: string;
  json?: { [key: string]: any };
  error?: Error | string | { [key: string]: any };
  headers?: { [key: string]: string };
  interface?: any;
  Blob?: Blob;
}

export interface EviateMiddlewareResponse {
  status?: number;
  header?: { [key: string]: string };
  ctx: Context;
}
