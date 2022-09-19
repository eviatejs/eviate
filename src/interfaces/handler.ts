import type { Context } from '../core/context';
import { BlurrResponse } from './response';

export type Handler = (ctx: Context) => BlurrResponse;
