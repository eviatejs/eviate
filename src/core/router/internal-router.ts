import event, { Emitter } from 'event-emitter';
import { BaseRouter } from './base';
import { Context } from '../context';
import { Tree } from '../tree/tree';
import { EngineError } from '../error';
import type { Handler } from '../../interfaces/handler';
import type { MatchedData } from '../../interfaces/match';
import type { EviateResponse } from '../../interfaces/response';
import { routeMount } from '../../utils/router-logger';

enum RouterEvent {
  Startup = 'startup',
  Shutdown = 'shutdown',
  BeforeRequest = 'before-request'
}

const allRouterEvents = '- ' + Object.values(RouterEvent).join('\n- ');

export class InternalRouter extends BaseRouter {
  public event: Emitter;
  public notFound: Handler | undefined;
  public routes: Map<string, Tree>;

  constructor() {
    super();
    this.routes = new Map([
      ['GET', new Tree()],
      ['POST', new Tree()],
      ['OPTIONS', new Tree()],
      ['HEAD', new Tree()],
      ['PUT', new Tree()],
      ['DELETE', new Tree()],
      ['PATCH', new Tree()]
    ]);

    this.event = event();
  }

  public register(method: string, path: string, handler: Handler) {
    const tree: Tree | undefined = this.routes.get(method);

    tree?.add(path, { handler: handler });
    routeMount(method, path);
  }

  public setNotFoundHandler(handler: Handler) {
    this.notFound = handler;
  }

  private match(method: string, path: string): MatchedData | null {
    const data = this.routes.get(method)?.find(path);

    if (data) {
      const returnData: MatchedData = {
        params: data.params,
        handler: data.data.handler
      };

      return returnData;
    }

    return null;
  }

  public serveHandler(ctx: Context): Response | null {
    const data = this.routes.get(ctx.method)?.find(ctx.path);

    if (!data) {
      return null;
    }

    ctx.params = data.params;
    const returnValue: EviateResponse = data.data.handler(ctx);

    ctx.res = new Response(returnValue.text || '', returnValue.headers);
    return ctx.res;
  }

  public on(name: string, callback: any) {
    switch (name) {
      case RouterEvent.Startup:
        this.event.on(name, callback);
        return;

      case RouterEvent.Shutdown:
        this.event.on(name, callback);
        return;

      case RouterEvent.BeforeRequest:
        this.event.on(name, callback);
        return;

      default:
        throw new Error(`Event handler supports only:\n${allRouterEvents}`);
    }
  }

  public error(callback: (err: EngineError, ctx?: Context) => void) {
    this.event.on('err', callback);
  }
}
