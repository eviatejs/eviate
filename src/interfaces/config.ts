import { MiddlewareHandler } from './middlewareHandler';

export interface config {
  port: number;
  host: string;
  debug: boolean;
  middlewares: MiddlewareHandler[];
}
