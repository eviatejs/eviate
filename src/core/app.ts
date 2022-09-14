import { AppState } from './state';
import { EventHandler } from './event-handler';
import { AppParamsSchema } from '../schema/AppParams';
import type { Serve } from 'bun';
import type { Handler } from '../interfaces/data';
import type { AppParamsInput } from '../schema/AppParams';
import { router } from './router';
import { Context } from './context';
import Router from './cacheRouter';
import type { route } from '../interfaces/cacheRoute';
export class Engine {
  private appState: AppState;
  private eventHandler: EventHandler = new EventHandler();
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
    return Bun.serve(this.serve());
  }

  public use(object: Router) {
    object.routes.filter((val: route) => {
      this.router.register(val.method, val.path, val.handler);
    });
    return;
  }

  private serve(): Serve {
    const router: router = this.router;
    return {
      //@ts-ignore
      async fetch(req: Request) {
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
}
