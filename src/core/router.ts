import { Context } from './context';
import { Tree } from './tree';
import { matchedData } from '../interfaces/match';
export class router {
  public notFound: (() => string) | undefined;
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
  public setNotFoundHandler(handler: () => string) {
    this.notFound = handler;
  }

  private register(method: string, path: string, handler: () => string) {
    const tree: Tree | undefined = this.routes.get(method);
    tree?.add(path, { handler: handler });
    return;
  }

  public get(path: string, handler: () => string) {
    this.register('GET', path, handler);
  }

  public post(path: string, handler: () => string) {
    this.register('POST', path, handler);
  }

  public patch(path: string, handler: () => string) {
    this.register('PATCH', path, handler);
  }
  public delete(path: string, handler: () => string) {
    this.register('DELETE', path, handler);
  }
  public options(path: string, handler: () => string) {
    this.register('OPTIONS', path, handler);
  }
  public head(path: string, handler: () => string) {
    this.register('HEAD', path, handler);
  }
  public put(path: string, handler: () => string) {
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
}
