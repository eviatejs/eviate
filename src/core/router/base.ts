import type { handler } from '../../interfaces/handler';

export abstract class BaseRouter {
  abstract register(method: string, path: string, handler: handler): void;

  public get(path: string, handler: handler) {
    this.register('GET', path, handler);
  }

  public post(path: string, handler: handler) {
    this.register('POST', path, handler);
  }

  public patch(path: string, handler: handler) {
    this.register('PATCH', path, handler);
  }

  public delete(path: string, handler: handler) {
    this.register('DELETE', path, handler);
  }

  public options(path: string, handler: handler) {
    this.register('OPTIONS', path, handler);
  }

  public head(path: string, handler: handler) {
    this.register('HEAD', path, handler);
  }

  public put(path: string, handler: handler) {
    this.register('PUT', path, handler);
  }
}
