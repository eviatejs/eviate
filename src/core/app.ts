import { AppState } from './state';
import { EventHandler } from './event-handler';
import { AppParamsSchema } from '../schema/AppParams';
import { Serve, Server } from 'bun';
import type { Handler } from '../interfaces/data';
import type { AppParamsInput } from '../schema/AppParams';
import { router } from './router';
import { Context } from './context';
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
