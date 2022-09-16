import { Context } from './context';
import { Tree } from './tree';
import type { Handler } from '../interfaces/data';
import { matchedData } from '../interfaces/match';
import { response } from '../interfaces/response';
import event, { Emitter } from 'event-emitter';
import { EngineError } from './error';
export class router {
  public notFound: Handler | undefined;
  public routes: Map<string, Tree>;
  public event: Emitter;
  constructor() {
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
  public setNotFoundHandler(handler: Handler) {
    this.notFound = handler;
  }

  public register(method: string, path: string, handler: Handler) {
    const tree: Tree | undefined = this.routes.get(method);
    tree?.add(path, { handler: handler });
    return;
  }

  public get(path: string, handler: Handler) {
    this.register('GET', path, handler);
  }

  public post(path: string, handler: Handler) {
    this.register('POST', path, handler);
  }

  public patch(path: string, handler: Handler) {
    this.register('PATCH', path, handler);
  }
  public delete(path: string, handler: Handler) {
    this.register('DELETE', path, handler);
  }
  public options(path: string, handler: Handler) {
    this.register('OPTIONS', path, handler);
  }
  public head(path: string, handler: Handler) {
    this.register('HEAD', path, handler);
  }
  public put(path: string, handler: Handler) {
    this.register('PUT', path, handler);
  }
  private match(method: string, path: string): matchedData | null {
    const data = this.routes.get(method)?.find(path);
    if (data) {
      const returnData: matchedData = {
        parmas: data.params,
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
    const returnval: response = data.data.handler(ctx);
    ctx.res = new Response(returnval.text || '', returnval.headers);
    return ctx.res;
  }
  public on(name: string, callback: any) {
    switch (name) {
      case 'startup': {
        this.event.on(name, callback);
        return;
      }
      case 'shutdown': {
        this.event.on(name, callback);
        return;
      }
      case 'beforeRequest': {
        this.event.on(name, callback);
        return;
      }
      default: {
        throw new Error('Event handler only supports ...');
      }
    }
  }

  public error(callback: (err: EngineError, ctx?: Context) => void) {
    this.event.on('err', callback);
  }
}
