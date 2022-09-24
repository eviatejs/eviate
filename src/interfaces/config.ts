import { MiddlewareHandler } from './middlewareHandler';

export interface config {
  port: number;
  hostname: string;
  debug: boolean;
  middlewares: MiddlewareHandler[];
}
