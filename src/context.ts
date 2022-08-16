export class Context {
  // Request object
  req: Request;

  // TODO: URL parameters
  // TODO: Body for the HTTP request

  // HTTP-related metadata
  readonly method: string;
  readonly path: string;
  readonly host: string;
  readonly headers: Request['headers'];
  readonly url: URL;

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

  // Methods to parse the JSON response returned and convert into valid `Request` object.
  // Ref: `dev/DESIGN.md`
}
