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
  public config: config;
  public router: InternalRouter;
  public middleware: Middleware;
  public eventEmitter: EventEmitter;

  constructor(
    config: config,
    router: InternalRouter,
    middleware: Middleware,
    eventEmitter: EventEmitter
  ) {
    this.config = config;
    this.router = router;
    this.middleware = middleware;
    this.eventEmitter = eventEmitter;
  }

  public getRuntime(): 'bun' | 'node' {
    // If `Bun` is defined on global scope, then we are running on bun runtime.
    // Else, we are running on node runtime.
    return typeof Bun !== 'undefined' ? 'bun' : 'node';
  }

  private serveBun(port: number, host: string, debug: boolean): Serve {
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
        const res = router.serveHandler(resp.ctx, resp.header || {});

        middleware.runAfter(ctx);

        return res;
      },

      // @ts-ignore
      error(error: Error) {
        console.log(error);
      }
    };
  }

  private serveNode(http: typeof import('node:http')) {
    // TODO: Fix with proper type. `IncomingMessage` unable to be converted to type.
    const convertIncomingMessageToRequest = (req: any): Request => {
      let headers: Record<string, string> = {};

      for (let key in req.headers) {
        if (req.headers.get(key)) headers[key] = req.headers.get(key) as string;
      }

      let request = new Request(req.url, {
        method: req.method,
        body: req.method === 'POST' ? req.body : null,
        headers
      });

      return request;
    };

    const server = http.createServer(async (req, res) => {
      this.router.event.emit('before-request');

      let request = convertIncomingMessageToRequest(req);

      let ctx: Context = new Context(request);

      const resp: EviateMiddlewareResponse = await this.middleware.runBefore(
        ctx
      );
      const response = this.router.serveHandler(resp.ctx, resp.header || {});

      this.middleware.runAfter(ctx);
      res.end(response);
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
      Bun.serve(this.serveBun(port, hostname, debug));
    } else {
      const http = await import('node:http');

      const server = this.serveNode(http);

      server.listen(port, hostname);
    }
  }
}
