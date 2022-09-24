import { Router } from './router/router';
import { InternalRouter } from './router/internal-router';
import { Context } from './context';
import { EngineError } from './error';
import { AppState } from './state';
import { startupBanner } from '../utils/startup-banner';
import {
  defaultAppMetadataParams,
  defaultAppStateParams
} from '../schema/AppParams';
import { defaultAppListenParams } from '../schema/AppListenParams';
import { Middleware } from './middlewares';
import { loadConfig } from '../utils/load-config';

import type { config, MiddlewareHandler } from '../interfaces';
import type { Serve } from 'bun';
import type { Emitter } from 'event-emitter';
import type { handler } from '../interfaces/handler';
import type { AppParams, AppMetadata } from '../schema/AppParams';
import type { AppListenParams } from '../schema/AppListenParams';
import type { Route } from '../interfaces/route';
import type { EviateMiddlewareResponse } from '../interfaces/response';

export enum MiddlewarePosition {
  Before = 'before',
  After = 'after'
}

export class Engine {
  public metadata: AppMetadata;
  public config?: config;

  private appState: AppState;
  private router!: InternalRouter;
  private eventEmitter: Emitter;
  private middleware: Middleware;

  constructor(params?: AppParams) {
    const { state, metadata } = {
      metadata: { ...defaultAppMetadataParams, ...params?.metadata },
      state: { ...defaultAppStateParams, ...params?.state }
    };

    this.metadata = metadata;
    this.appState = new AppState(state);

    this.middleware = new Middleware();
    this.router = new InternalRouter();
    this.eventEmitter = this.router.event;

    loadConfig(this);

    startupBanner();
  }

  public get(path: string, handler: handler) {
    this.router.get(path, handler);
  }

  public put(path: string, handler: handler) {
    this.router.put(path, handler);
  }

  public patch(path: string, handler: handler) {
    this.router.patch(path, handler);
  }

  public delete(path: string, handler: handler) {
    this.router.delete(path, handler);
  }

  public head(path: string, handler: handler) {
    this.router.head(path, handler);
  }

  public options(path: string, handler: handler) {
    this.router.options(path, handler);
  }

  public post(path: string, handler: handler) {
    this.router.post(path, handler);
  }

  public async listen(params?: AppListenParams) {
    const { port, hostname, debug } = {
      ...defaultAppListenParams,
      ...this.config,
      ...params
    };

    this.eventEmitter.emit('startup');

    return Bun.serve(this.serve(port, hostname, debug));
  }

  public mount(router: Router, prefix?: string) {
    router.routes.map((value: Route) => {
      if (!prefix) {
        this.router.register(value.method, value.path, value.handler);
      } else {
        this.router.register(value.method, prefix + value.path, value.handler);
      }
    });
  }

  public use(pos: string, context: MiddlewareHandler) {
    switch (pos) {
      case MiddlewarePosition.Before:
        this.middleware.register(0, context);
        return;

      case MiddlewarePosition.After:
        this.middleware.register(1, context);
        return;

      default:
        throw new Error('Invalid middleware position.');
    }
  }

  public on(name: string, callback: () => void) {
    this.router.on(name, callback);
  }

  public error(callback: (err: EngineError, ctx?: Context) => void) {
    this.router.error(callback);
  }

  private serve(port: number, host: string, debug: boolean): Serve {
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

  public shutdown() {
    this.eventEmitter.emit('shutdown');
    process.exit(0);
  }
}
