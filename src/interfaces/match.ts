import type { Handler } from './handler';

export interface MatchedData {
  params: any; // TODO: Add proper typing.
  handler: Handler;
}
