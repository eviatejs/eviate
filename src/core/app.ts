import { Server } from '../runtime/server';
import { Router } from './router/router';
import { InternalRouter } from './router/internal-router';
import { Context } from './context';
import { EngineError } from './error';
import { AppState } from './state';
import { startupBanner } from '../utils/startup-banner';
import { Middleware } from './middlewares';
import { loadConfig } from '../utils/load-config';
import { UserMiddlewarePosition } from '../mappings/MiddlewarePosition';
import {
  defaultAppMetadataParams,
  defaultAppStateParams
} from '../schema/AppParams';
import { EviatePlugin } from './plugin';

import type { EventEmitter } from 'sweet-event-emitter';
import type { config, MiddlewareHandler } from '../interfaces';
import type { handler } from '../interfaces/handler';
import type { AppParams, AppMetadata } from '../schema/AppParams';
import type { AppListenParams } from '../schema/AppListenParams';
import type { Route } from '../interfaces/route';
import type { EviateMiddlewareResponse } from '../interfaces/response';

export class Engine {
  public metadata: AppMetadata;
  public config?: config;

  private server: Server;
  private plugins: EviatePlugin;
  private appState: AppState;
  private router: InternalRouter;
  private eventEmitter: EventEmitter;
  private middleware: Middleware;

  constructor(params?: AppParams) {
    const { state, metadata } = {
      metadata: { ...defaultAppMetadataParams, ...params?.metadata },
      state: { ...defaultAppStateParams, ...params?.state }
    };

    loadConfig(this);

    this.metadata = metadata;

    this.appState = new AppState({ ...state, ...this.config?.state });
    this.plugins = new EviatePlugin(this);
    this.middleware = new Middleware();
    this.router = new InternalRouter(this);
    this.eventEmitter = this.router.event;

    this.server = new Server(
      this.router,
      this.middleware,
      this.eventEmitter,
      this.config
    );

    startupBanner(this.server.getRuntime());
  }

  // Region: Getters and setters (properties)
  public get plugin(): EviatePlugin {
    return this.plugins;
  }
  // Endregion

  // Region: Route methods and registering
  public register(method: string, path: string, handler: handler) {
    this.router.register(method, path, handler);
  }

  public get(path: string, handler: handler) {
    this.router.get(path, handler);
  }

  public put(path: string, handler: handler) {
    this.router.put(path, handler);
  }

  public patch(path: string, handler: handler) {
    this.router.patch(path, handler);
  }

  public delete(path: string, handler: handler) {
    this.router.delete(path, handler);
  }

  public head(path: string, handler: handler) {
    this.router.head(path, handler);
  }

  public options(path: string, handler: handler) {
    this.router.options(path, handler);
  }

  public post(path: string, handler: handler) {
    this.router.post(path, handler);
  }
  // Endregion

  // Region: Route and middleware mounting
  public mount(router: Router, prefix?: string) {
    this.router.event.emit('router-mount');

    router.routes.map((value: Route) => {
      if (!prefix) {
        this.router.register(value.method, value.path, value.handler);
      } else {
        this.router.register(value.method, prefix + value.path, value.handler);
      }
    });
  }

  public use(
    context: MiddlewareHandler,
    pos: string = UserMiddlewarePosition.Before
  ) {
    switch (pos) {
      case UserMiddlewarePosition.Before:
        this.middleware.register(0, context);
        return;

      case UserMiddlewarePosition.After:
        this.middleware.register(1, context);
        return;

      default:
        throw new Error('Invalid middleware position.');
    }
  }
  // Endregion

  // Region: Events and error handler
  public on(name: string, callback: (...args: any[]) => void) {
    this.router.on(name, callback);
  }

  public error(callback: (err: EngineError, ctx?: Context) => void) {
    this.router.error(callback);
  }
  // Endregion

  // Region: Running the app
  public async listen(params?: AppListenParams) {
    this.server.listen(params);
  }

  public shutdown() {
    this.eventEmitter.emit('shutdown');
    process.exit(0);
  }
  // Endregion
}
