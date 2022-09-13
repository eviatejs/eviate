import { MiddlewarePosition } from '../enums/MiddlewarePosition';

import type { Context } from '../core/context';

interface MiddlewareHandler {
  (ctx: Context): Context | Promise<Context>;
}

export class Middleware {
  private before: MiddlewareHandler[] = [];
  private after: MiddlewareHandler[] = [];

  // Register a middleware
  public register(position: MiddlewarePosition, handler: MiddlewareHandler) {
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
  private async runBefore(ctx: Context): Promise<Context> {
    for (const handler of this.before) {
      ctx = await handler(ctx);
    }

    return ctx;
  }

  // Run the after middleware functions
  private async runAfter(ctx: Context): Promise<Context> {
    for (const handler of this.after) {
      ctx = await handler(ctx);
    }

    return ctx;
  }
}
