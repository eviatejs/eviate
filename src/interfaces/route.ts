import { Handler } from './handler';

export interface Route {
  method: string;
  path: string;
  handler: Handler;
}
