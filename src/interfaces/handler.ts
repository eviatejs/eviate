import type { Context } from '../core/context';
import type { EviateResponse } from './response';

export type handler = (ctx: Context) => EviateResponse;
