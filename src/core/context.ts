export class Context {
  req: Request;

  // HTTP-related metadata
  readonly method: string;
  readonly path: string;
  readonly host: string;
  readonly headers: Request['headers'];
  readonly url: URL;

  // TODO: URL parameters
  // TODO: Body for the HTTP request

  // TODO: App global state

  constructor(req: Request) {
    this.req = req;

    const url = new URL(req.url);

    this.method = req.method;
    this.path = url.pathname;
    this.host = url.host;
    this.headers = req.headers;
    this.url = url;

    this.req.blob();
  }

  // Getter to check if the protocol is secure or not
  public get secure(): boolean {
    return this.url.protocol === 'https' || this.url.protocol === 'wss';
  }

  // Methods to parse the JSON response returned and convert into valid `Request` object.
  // Ref: `dev/DESIGN.md`
}