import { Context } from './context';
import { Tree } from './tree';
import type { Handler } from '../interfaces/data';
import { matchedData } from '../interfaces/match';

export class router {
  public notFound: Handler | undefined;
  public routes: Map<string, Tree>;
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
  }
  public setNotFoundHandler(handler: Handler) {
    this.notFound = handler;
  }

  private register(method: string, path: string, handler: Handler) {
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
    const returnval: string = data.data.handler(ctx);
    ctx.res = new Response(returnval);
    return ctx.res;
  }
}
