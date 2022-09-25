import { Plugin } from 'eviate-plugin';
import { Router } from '../core';
import { MiddlewareHandler } from './middlewareHandler';

export interface config {
  port: number;
  hostname: string;
  debug: boolean;
  state?: Record<string, any>;
  startMiddlewares?: MiddlewareHandler[];
  endMiddlewares?: MiddlewareHandler[];
  routers?: Router[];
  plugins?: Plugin[];
}
