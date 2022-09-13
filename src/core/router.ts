import { Context } from './context';
import { Tree } from './tree';

export class router {
  public notFound: Context;
  public hanlder: Context;
  public routes: [];
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
