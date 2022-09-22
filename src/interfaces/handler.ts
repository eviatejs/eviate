import type { Context } from '../core/context';
import { EviateResponse } from './response';

export type handler = (ctx: Context) => EviateResponse;
