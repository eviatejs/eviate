import { Context } from '../core';
import { EviateMiddlewareResponse } from './response';

export interface MiddlewareHandler {
  (ctx: Context): EviateMiddlewareResponse | Promise<EviateMiddlewareResponse>;
}
