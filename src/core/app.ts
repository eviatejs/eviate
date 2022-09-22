import Router from './router/router';
import { InternalRouter } from './router/internal-router';
import { Context } from './context';
import { EngineError } from './error';
import { AppState } from './state';
import { startupBanner } from '../utils/startup-banner';
import { AppParamsSchema } from '../schema/AppParams';
import { AppListenParams } from '../schema/AppListenParams';
import type { Serve } from 'bun';
import type { Emitter } from 'event-emitter';
import type { Handler } from '../interfaces/handler';
import type { AppParamsInput, AppMetadata } from '../schema/AppParams';
import type { AppListenParamsInput } from '../schema/AppListenParams';
import type { Route } from '../interfaces/route';

export class Engine {
  public metadata: AppMetadata;

  private appState: AppState;
  private router!: InternalRouter;
  private eventEmitter: Emitter;

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

    console.log(this.metadata);

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

  // Move host, and debug to the extra params and use zod.
  public listen(params?: AppListenParamsInput) {
    const parsedParams = AppListenParams.safeParse({ ...params });

    if (!parsedParams.success) {
      throw new Error('Invalid params'); // TODO: Replace with custom errors
    }

    const { port, hostname, debug } = parsedParams.data;

    this.eventEmitter.emit('startup');

    return Bun.serve(this.serve(port, hostname, debug));
  }

  public use(router: Router) {
    router.routes.map((value: Route) => {
      this.router.register(value.method, value.path, value.handler);
    });
  }

  public on(name: string, callback: () => void) {
    this.router.on(name, callback);
  }

  public error(callback: (err: EngineError, ctx?: Context) => void) {
    this.router.error(callback);
  }

  private serve(port: number, host: string, debug: boolean): Serve {
    const router: InternalRouter = this.router;

    return {
      port: port,
      hostname: host,
      debug: debug,

      // @ts-ignore
      async fetch(req: Request) {
        router.event.emit('before-request');

        const ctx: Context = new Context(req);
        const res = router.serveHandler(ctx);

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
  }
}
