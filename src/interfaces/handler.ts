import type { Context } from '../core/context';
import { response } from './response';

export type Handler = (ctx: Context) => response;
