import { handler } from './handler';

export interface Route {
  method: string;
  path: string;
  handler: handler;
}
