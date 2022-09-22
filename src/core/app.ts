import { Router } from './router/router';
import { InternalRouter } from './router/internal-router';
import { Context } from './context';
import { EngineError } from './error';
import { AppState } from './state';
import { startupBanner } from '../utils/startup-banner';
import { AppParamsSchema } from '../schema/AppParams';
import { AppListenParams } from '../schema/AppListenParams';
import { Middleware, MiddlewareHandler } from './middlewares';

import type { Serve } from 'bun';
import type { Emitter } from 'event-emitter';
import type { Handler } from '../interfaces/handler';
import type { AppParamsInput, AppMetadata } from '../schema/AppParams';
import type { AppListenParamsInput } from '../schema/AppListenParams';
import type { Route } from '../interfaces/route';
import type { EviateMiddlewareResponse } from '../interfaces/response';

export class Engine {
  public metadata: AppMetadata;

  private appState: AppState;
  private router!: InternalRouter;
  private eventEmitter: Emitter;
  private middleware: Middleware;

  constructor(params?: AppParamsInput) {
    try {
      const { state, metadata } = AppParamsSchema.parse(params);

      this.metadata = metadata;
      this.appState = new AppState(state);
    } catch (optionParseError) {
      const { state, metadata } = AppParamsSchema.parse({});

      this.metadata = metadata;
      this.appState = new AppState(state);
    }

    this.middleware = new Middleware();
    this.router = new InternalRouter();
    this.eventEmitter = this.router.event;

    startupBanner();
  }

  public get(path: string, handler: Handler) {
    this.router.get(path, handler);
  }

  public put(path: string, handler: Handler) {
    this.router.put(path, handler);
  }

  public patch(path: string, handler: Handler) {
    this.router.patch(path, handler);
  }

  public delete(path: string, handler: Handler) {
    this.router.delete(path, handler);
  }

  public head(path: string, handler: Handler) {
    this.router.head(path, handler);
  }

  public options(path: string, handler: Handler) {
    this.router.options(path, handler);
  }

  public post(path: string, handler: Handler) {
    this.router.post(path, handler);
  }

  public listen(params?: AppListenParamsInput) {
    const parsedParams = AppListenParams.safeParse({ ...params });

    if (!parsedParams.success) {
      throw new Error('Invalid params'); // TODO: Replace with custom errors
    }

    const { port, hostname, debug } = parsedParams.data;

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

  public on(name: string, callback: () => void) {
    this.router.on(name, callback);
  }

  public use(pos: string, context: MiddlewareHandler) {
    switch (pos) {
      case 'start':
        this.middleware.register(0, context);
        return;

      case 'end':
        this.middleware.register(1, context);
        return;

      default:
        throw new Error('Sunrit implement this lol');
    }
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
