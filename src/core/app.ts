import Router from './router';
import { InternalRouter } from './internal-router';
import { Context } from './context';
import { EngineError } from './error';
import { AppState } from './state';
import { AppParamsSchema } from '../schema/AppParams';

import type { Serve } from 'bun';

import type { Handler } from '../interfaces/data';
import type { AppParamsInput } from '../schema/AppParams';
import type { route } from '../interfaces/cacheRoute';

export class Engine {
  private appState: AppState;
  private router!: InternalRouter;

  constructor(params?: AppParamsInput) {
    const parsedParams = AppParamsSchema.safeParse({ ...params });

    if (!parsedParams.success) {
      this.appState = new AppState({});
    } else {
      const { state } = parsedParams.data;

      this.appState = new AppState(state);
    }

    this.router = new InternalRouter();
  }

  public get(path: string, handler: Handler) {
    this.router.get(path, handler);
  }

  // Move host, and debug to the extra params and use zod.
  public listen(port: number = 3000, host: string = '127.0.0.1') {
    this.router.event.emit('startup');

    return Bun.serve(this.serve(port, host));
  }

  public use(object: Router) {
    object.routes.filter((val: route) => {
      this.router.register(val.method, val.path, val.handler);
    });
  }

  public on(name: string, callback: any) {
    this.router.on(name, callback);
  }

  public error(callback: (err: EngineError, ctx?: Context) => void) {
    this.router.error(callback);
  }

  private serve(port: number, host: string): Serve {
    const router: InternalRouter = this.router;

    return {
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
      },

      port: port,
      hostname: host,
      development: false
    };
  }

  public shutdown() {
    this.router.event.emit('shutdown');
  }
}
