import Router from './router/router';
import { InternalRouter } from './router/internal-router';
import { Context } from './context';
import { EngineError } from './error';
import { AppState } from './state';
import { AppParamsSchema } from '../schema/AppParams';
import { AppListenParams } from '../schema/AppListenParams';

import type { Serve } from 'bun';
import type { Emitter } from 'event-emitter';
import type { Handler } from '../interfaces/handler';
import type { AppParamsInput } from '../schema/AppParams';
import type { AppListenParamsInput } from '../schema/AppListenParams';
import type { Route } from '../interfaces/route';

export class Engine {
  private appState: AppState;
  private router!: InternalRouter;
  private eventEmitter: Emitter;

  constructor(params?: AppParamsInput) {
    const parsedParams = AppParamsSchema.safeParse({ ...params });

    if (!parsedParams.success) {
      this.appState = new AppState({});
    } else {
      const { state } = parsedParams.data;

      this.appState = new AppState(state);
    }

    this.router = new InternalRouter();
    this.eventEmitter = this.router.event;
  }

  public get(path: string, handler: Handler) {
    this.router.get(path, handler);
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
