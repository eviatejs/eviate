import type { handler } from './handler';

export interface MatchedData {
  params: any; // TODO: Add proper typing.
  handler: handler;
}
