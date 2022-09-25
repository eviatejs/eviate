import { EviatePlugin } from './plugin/plugin';
import { Plugin } from 'eviate-plugin';

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
import { UserMiddlewarePosition } from '../mappings/MiddlewarePosition';

import type { Serve } from 'bun';
import type { config, MiddlewareHandler } from '../interfaces';
import type { EventEmitter } from '../utils/event-emitter';
import type { handler } from '../interfaces/handler';
import type { AppParams, AppMetadata } from '../schema/AppParams';
import type { AppListenParams } from '../schema/AppListenParams';
import type { Route } from '../interfaces/route';
import type { EviateMiddlewareResponse } from '../interfaces/response';

export class Engine {
  public metadata: AppMetadata;
  public config?: config;

  private appState: AppState;
  private router: InternalRouter;
  private eventEmitter: EventEmitter;
  private middleware: Middleware;

  constructor(params?: AppParams) {
    const { state, metadata } = {
      metadata: { ...defaultAppMetadataParams, ...params?.metadata },
      state: { ...defaultAppStateParams, ...params?.state }
    };

    loadConfig(this);

    this.metadata = metadata;
    this.appState = new AppState({ ...state, ...this.config?.state });

    this.middleware = new Middleware();
    this.router = new InternalRouter();
    this.eventEmitter = this.router.event;

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
    this.handlePlugin();
    const { port, hostname, debug } = {
      ...this.config,
      ...params,
      ...defaultAppListenParams
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
      case UserMiddlewarePosition.Before:
        this.middleware.register(0, context);
        return;

      case UserMiddlewarePosition.After:
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

  public get plugin(): EviatePlugin {
    return this.router.plugin;
  }

  private handlePlugin() {
    const plugin = this.router.plugin;

    plugin.getAllPlugins().forEach((plugin: Plugin) => {
      plugin.middlewares(this);
      plugin.routes;
    });
  }

  public shutdown() {
    this.eventEmitter.emit('shutdown');
    process.exit(0);
  }
}
