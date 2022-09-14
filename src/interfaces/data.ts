import type { Context } from '../core/context';

export interface data {
  handler: Handler;
}

export type Handler = (ctx: Context) => string;
