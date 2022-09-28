import { Router } from './router/router';
import { InternalRouter } from './router/internal-router';
import { Context } from './context';
import { EngineError } from './error';
import { AppState } from './state';
import { startupBanner } from '../utils/startup-banner';
import { Middleware } from './middlewares';
import { loadConfig } from '../utils/load-config';
import { UserMiddlewarePosition } from '../mappings/MiddlewarePosition';
import {
  defaultAppMetadataParams,
  defaultAppStateParams
} from '../schema/AppParams';
import { defaultAppListenParams } from '../schema/AppListenParams';
import http from 'node:http';
import type { EventEmitter } from 'sweet-event-emitter';
import type { config, MiddlewareHandler } from '../interfaces';
import type { handler } from '../interfaces/handler';
import type { AppParams, AppMetadata } from '../schema/AppParams';
import type { AppListenParams } from '../schema/AppListenParams';
import type { Route } from '../interfaces/route';
import type { EviateMiddlewareResponse } from '../interfaces/response';
import { EviatePlugin } from './plugin';

export class Engine {
  public metadata: AppMetadata;
  public config?: config;
  private plugins: EviatePlugin;

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
    this.plugins = new EviatePlugin(this);

    this.middleware = new Middleware();
    this.router = new InternalRouter(this);
    this.eventEmitter = this.router.event;

    startupBanner();
  }

  // Region: Route methods and registering
  public register(method: string, path: string, handler: handler) {
    this.router.register(method, path, handler);
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

  // Region: Route and middleware mounting
  public mount(router: Router, prefix?: string) {
    this.router.event.emit('router-mount');
    router.routes.map((value: Route) => {
      if (!prefix) {
        this.router.register(value.method, value.path, value.handler);
      } else {
        this.router.register(value.method, prefix + value.path, value.handler);
      }
    });
  }

  public use(
    context: MiddlewareHandler,
    pos: string = UserMiddlewarePosition.Before
  ) {
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

  public get plugin(): EviatePlugin {
    return this.plugins;
  }

  // Region: Events
  public on(name: string, callback: () => void) {
    this.router.on(name, callback);
  }

  public error(callback: (err: EngineError, ctx?: Context) => void) {
    this.router.error(callback);
  }

  // Region: Running the app
  private Bunserve(port: number, host: string, debug: boolean): any {
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

  public async listen(runtime: string, params?: AppListenParams) {
    const { port, hostname, debug } = {
      ...this.config,
      ...params,
      ...defaultAppListenParams
    };

    this.eventEmitter.emit('startup');
    if (runtime == 'node') {
      this.nodeServe(port, hostname);
    } else {
      Bun.serve(this.Bunserve(port, hostname, debug));
    }
  }

  private nodeServe(port: number, host: string) {
    http
      .createServer((req, res) => {
        // res.end("H")
        const req2 = new Request(req?.url || '');
        console.log(req2);
        // return new Response("Hello")
      })
      .listen(port, host);
  }

  public shutdown() {
    this.eventEmitter.emit('shutdown');
    process.exit(0);
  }
}
