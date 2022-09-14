import type { route } from '../interfaces/cacheRoute';
import type { Handler } from '../interfaces/data';
export default class Router {
  public routes: route[];
  constructor() {
    this.routes = [];
  }
  private register(method: string, path: string, handler: Handler) {
    this.routes.push({ method: method, path: path, handler: handler });
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
  public getRoutes(): route[] | undefined {
    return this.routes;
  }
}
