import { Context } from '../core';
import { defaultAppListenParams } from '../schema/AppListenParams';

import type { Serve } from 'bun';
import type { EventEmitter } from 'sweet-event-emitter';
import type { Middleware } from '../core/middlewares';
import type { config, EviateMiddlewareResponse } from '../interfaces';
import type { InternalRouter } from '../core/router/internal-router';
import type { AppListenParams } from '../schema/AppListenParams';

// Server that runs on bun/node runtime independently.
export class Server {
  public config?: config;
  public router: InternalRouter;
  public middleware: Middleware;
  public eventEmitter: EventEmitter;

  constructor(
    router: InternalRouter,
    middleware: Middleware,
    eventEmitter: EventEmitter,
    config?: config
  ) {
    this.router = router;
    this.middleware = middleware;
    this.eventEmitter = eventEmitter;
    this.config = config;
  }

  public getRuntime(): 'bun' | 'node' {
    // If `Bun` is defined on global scope, then we are running on bun runtime.
    // Else, we are running on node runtime.
    return typeof Bun !== 'undefined' ? 'bun' : 'node';
  }

  private serveBun(host: string, port: number, debug: boolean): Serve {
    const router: InternalRouter = this.router;
    const middleware: Middleware = this.middleware;

    return {
      port: port,
      hostname: host,
      debug: debug,

      // @ts-ignore
      async fetch(req: Request) {
        router.event.emit('before-request');

        let ctx: Context = new Context(req);

        const resp: EviateMiddlewareResponse = await middleware.runBefore(ctx);
        const res = router.serveBunHandler(resp.ctx, resp.header || {});

        middleware.runAfter(ctx);

        return res;
      },

      // @ts-ignore
      error(error: Error) {
        console.log(error);
      }
    };
  }

  private serveNode(
    http: typeof import('node:http'),
    hostname: string,
    port: number
  ) {
    const server = http.createServer(async (req, res) => {
      const standardRequest = new Request(
        `http://${hostname}:${port}${req.url}`
      );
      const ctx: Context = new Context(standardRequest);
      const resp: EviateMiddlewareResponse = await this.middleware.runBefore(
        ctx
      );

      const bool: boolean = this.router.serveNodeHandler(
        resp.ctx,
        resp.header || {},
        res
      );

      if (bool) {
        this.middleware.runAfter(resp.ctx);
      }
    });

    return server;
  }

  public async listen(params?: AppListenParams) {
    const runtime = this.getRuntime();

    const { port, hostname, debug } = {
      ...this.config,
      ...params,
      ...defaultAppListenParams
    };

    this.eventEmitter.emit('startup');

    if (runtime === 'bun') {
      Bun.serve(this.serveBun(hostname, port, debug));
    } else {
      const http = await import('node:http');

      this.serveNode(http, hostname, port).listen(port, hostname);
    }
  }
}
