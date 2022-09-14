import type { Context } from '../core/context';
import { response } from './response';

export interface data {
  handler: Handler;
}

export type Handler = (ctx: Context) => response;
