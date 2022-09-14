import { Handler } from './data';

export interface route {
  method: string;
  path: string;
  handler: Handler;
}
