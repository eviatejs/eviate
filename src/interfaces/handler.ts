import type { Context } from '../core/context';
import { EviateResponse } from './response';

export type Handler = (ctx: Context) => EviateResponse;
