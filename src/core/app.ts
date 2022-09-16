import { AppState } from './state';

import { AppParamsSchema } from '../schema/AppParams';
import type { Serve } from 'bun';
import type { Handler } from '../interfaces/data';
import type { AppParamsInput } from '../schema/AppParams';
import { router } from './router';
import { Context } from './context';
import Router from './cacheRouter';
import type { route } from '../interfaces/cacheRoute';
import { EngineError } from './error';
export class Engine {
  private appState: AppState;
  private router!: router;
  constructor(params: AppParamsInput) {
    const parsedParams = AppParamsSchema.safeParse(params);

    if (!parsedParams.success) {
      this.appState = new AppState({});
    } else {
      const { state } = parsedParams.data;

      this.appState = new AppState(state);
    }
    this.router = new router();
  }
  public get(path: string, handler: Handler) {
    this.router.get(path, handler);
  }

  public listen(port?: number) {
    this.router.event.emit('startup');
    return Bun.serve(this.serve());
  }

  public use(object: Router) {
    object.routes.filter((val: route) => {
      this.router.register(val.method, val.path, val.handler);
    });
    return;
  }

  public on(name: string, callback: any) {
    this.router.on(name, callback);
  }

  public error(callback: (err: EngineError, ctx?: Context) => void) {
    this.router.error(callback);
  }

  private serve(): Serve {
    const router: router = this.router;
    return {
      //@ts-ignore
      async fetch(req: Request) {
        router.event.emit('beforeRequest');
        const ctx: Context = new Context(req);
        const res = router.serveHandler(ctx);
        return res;
      },
      //@ts-ignore
      error(error: Error) {
        console.log(error);
      },
      port: 3000,
      development: false,
      hostname: '0.0.0.0'
    };
  }

  public shutdown() {
    this.router.event.emit('shutdown');
  }
}
