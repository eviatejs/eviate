import { BaseRouter } from './base';

import type { Route } from '../../interfaces/route';
import type { Handler } from '../../interfaces/handler';

export default class Router extends BaseRouter {
  public routes: Route[];

  constructor() {
    super();

    this.routes = [];
  }

  public register(method: string, path: string, handler: Handler) {
    this.routes.push({ method: method, path: path, handler: handler });
  }

  public getAllRoutes(): Route[] | undefined {
    return this.routes;
  }
}
