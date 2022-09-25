import { MiddlewarePosition } from '../mappings/MiddlewarePosition';

import type { Context } from '../core/context';
import { EviateMiddlewareResponse } from '../interfaces/response';
import { MiddlewareHandler } from '../interfaces';

type MiddlewarePositionKeys = keyof typeof MiddlewarePosition;
type MiddlewarePositionValues =
  typeof MiddlewarePosition[MiddlewarePositionKeys];

export class Middleware {
  private before: MiddlewareHandler[] = [];
  private after: MiddlewareHandler[] = [];

  public register(
    position: MiddlewarePositionValues,
    handler: MiddlewareHandler
  ) {
    switch (position) {
      case MiddlewarePosition.Before:
        this.before.push(handler);
        break;

      case MiddlewarePosition.After:
        this.after.push(handler);
        break;
    }
  }

  // Run the before middleware functions
  public async runAfter(ctx: Context): Promise<EviateMiddlewareResponse> {
    let resp: EviateMiddlewareResponse = { ctx: ctx };
    for (const handler of this.before) {
      resp = await handler(ctx);
    }
    return resp;
  }

  // Run the after middleware functions
  public async runBefore(ctx: Context): Promise<EviateMiddlewareResponse> {
    let resp: EviateMiddlewareResponse = { ctx: ctx, header: {} };
    this.before.forEach(async (handler: MiddlewareHandler) => {
      const mutate: EviateMiddlewareResponse = await handler(ctx);
      mutate.header = this.appendHeaders(
        resp.header || {},
        mutate.header || null
      );
      resp = mutate;
      return resp;
    });
    return resp;
  }

  private appendHeaders(
    orignal: { [key: string]: string },
    mutate: { [key: string]: string } | null
  ): { [key: string]: string } {
    if (!mutate) {
      return orignal;
    }
    for (const header in mutate) {
      orignal[header] = mutate[header];
    }
    return orignal;
  }
}
