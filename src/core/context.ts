import { throws } from 'node:assert';
import { readFileSync } from 'node:fs';

class BaseContext {
  req: Request;
  res?: Response;

  public params: any; // TODO: Add correct type here.
  readonly body: {};
  readonly method: string;
  readonly path: string;
  readonly host: string;
  readonly headers: Request['headers'];
  readonly url: URL;

  constructor(req: Request) {
    this.req = req;
    this.method = req.method;
    this.headers = req.headers;
    this.body = req.json();
    const url = new URL(req.url || '');
    this.path = url.pathname;
    this.host = url.host;
    this.url = url;

    this.res = undefined;
    this.req.blob();
  }
}

export class Context extends BaseContext {
  constructor(req: Request) {
    super(req);
  }

  public get secure(): boolean {
    return this.url.protocol === 'https' || this.url.protocol === 'wss';
  }

  public file(path: string): Buffer {
    const file = readFileSync(path);
    return file;
  }
}
