import { MiddlewareHandler } from './middlewareHandler';

export interface config {
  port: number;
  hostname: string;
  debug: boolean;
  state: Record<string, any>;
  middlewares: MiddlewareHandler[];
}
