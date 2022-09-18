import type { Route } from '../interfaces/route';
import type { Handler } from '../interfaces/handler';

export default class Router {
  public routes: Route[];

  constructor() {
    this.routes = [];
  }

  private register(method: string, path: string, handler: Handler) {
    this.routes.push({ method: method, path: path, handler: handler });
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

  // Get all the routes
  public getRoutes(): Route[] | undefined {
    return this.routes;
  }
}
