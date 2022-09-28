import { MiddlewarePosition } from '../mappings/MiddlewarePosition';

import type { Context } from '../core/context';
import type { EviateMiddlewareResponse } from '../interfaces/response';
import type { MiddlewareHandler } from '../interfaces';

type MiddlewarePositionKeys = keyof typeof MiddlewarePosition;
type MiddlewarePositionValues =
  typeof MiddlewarePosition[MiddlewarePositionKeys];

type StringObject = { [key: string]: string };

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

  public async runBefore(ctx: Context): Promise<EviateMiddlewareResponse> {
    let resp: EviateMiddlewareResponse = { ctx: ctx, header: {} };

    this.before.forEach(async (handler: MiddlewareHandler) => {
      const mutate: EviateMiddlewareResponse = await handler(ctx);

      mutate.header = this.appendHeaders(
        resp.header || {},
        mutate.header || undefined
      );
      resp = mutate;

      return resp;
    });

    return resp;
  }

  public async runAfter(ctx: Context): Promise<EviateMiddlewareResponse> {
    let resp: EviateMiddlewareResponse = { ctx: ctx };

    for (const handler of this.before) {
      resp = await handler(ctx);
    }

    return resp;
  }

  private appendHeaders(
    orignal: StringObject,
    mutate?: StringObject
  ): StringObject {
    if (!mutate) {
      return orignal;
    }
    for (const header in mutate) {
      orignal[header] = mutate[header];
    }
    return orignal;
  }
}
