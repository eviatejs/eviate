export class Router {
  public name: string;
  public urlPrefix?: string;

  // TODO: Implement middleware support in the router.
  // TODO: Add support for registering methods, and nested routers (a router can have multiple child routers).

  constructor(name: string, urlPrefix?: string) {
    this.name = name;
    this.urlPrefix = urlPrefix;
  }
}
