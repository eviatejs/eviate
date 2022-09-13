import { Context } from './context';
import { Tree } from './tree';

export class router {
  public notFound: Context | undefined;
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
}
