import type { Context } from '../core/context';
import { Response } from './response';

export type Handler = (ctx: Context) => Response;
