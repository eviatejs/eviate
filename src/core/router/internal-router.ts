import { EventEmitter } from 'sweet-event-emitter';
import { BaseRouter } from './base';
import { Context } from '../context';
import { Tree } from '../tree/tree';
import { EngineError } from '../error';
import { routeMount } from '../../utils/router-logger';
import { RouterEvent } from '../../mappings/RouterEvent';
import type { handler } from '../../interfaces/handler';
import type { MatchedData } from '../../interfaces/match';
import type { EviateResponse } from '../../interfaces/response';
import { EviatePlugin } from '../plugin/plugin';
import { Engine } from '../app';
import { ServerResponse, IncomingMessage } from 'node:http';

const allRouterEvents = '- ' + Object.values(RouterEvent).join('\n- ');

export class InternalRouter extends BaseRouter {
  public event: EventEmitter;
  public routes: Map<string, Tree>;
  public isRan: boolean;
  public notFound: handler | undefined;
  public pluginsRan: boolean;

  private state: Engine;

  constructor(state: Engine) {
    super();

    this.routes = new Map([
      ['GET', new Tree()],
      ['POST', new Tree()],
      ['OPTIONS', new Tree()],
      ['HEAD', new Tree()],
      ['PUT', new Tree()],
      ['DELETE', new Tree()],
      ['PATCH', new Tree()]
    ]);
    this.isRan = false;
    this.state = state;
    this.event = new EventEmitter();

    this.pluginsRan = false;
  }

  public register(method: string, path: string, handler: handler) {
    const tree: Tree | undefined = this.routes.get(method);
    tree?.add(path, { handler: handler });
    routeMount(method, path);
  }

  public setNotFoundHandler(handler: handler) {
    this.notFound = handler;
  }

  private match(method: string, path: string): MatchedData | null {
    const data = this.routes.get(method)?.find(path);

    if (data) {
      const returnData: MatchedData = {
        params: data.params,
        handler: data.data.handler
      };

      return returnData;
    }

    return null;
  }

  public serveBunHandler(
    ctx: Context,
    headers: { [key: string]: string }
  ): Response | null {
    const data = this.routes.get(ctx.method)?.find(ctx.path);

    if (!data) return null;

    ctx.params = data.params;

    const returnValue: EviateResponse = data.data.handler(ctx);
    if (!returnValue.headers) returnValue.headers = {};

    for (const header in headers) {
      returnValue.headers[header] = headers[header];
    }

    if (returnValue.text !== undefined && returnValue.json !== undefined) {
      throw new Error("You can't send both text and json object as response");
    }

    if (returnValue.error) {
      return new Response(JSON.stringify(returnValue.error) || '', {
        headers: returnValue.headers,
        status: returnValue.status || 404
      });
    }

    if (returnValue.headers) {
      switch (returnValue.headers['Content-type']) {
        case 'application/json':
          ctx.res = new Response(JSON.stringify(returnValue.json) || '', {
            headers: returnValue.headers,
            status: returnValue.status || 200
          });

          return ctx.res;

        case 'text/plain':
          ctx.res = new Response(returnValue.text || '', {
            headers: returnValue.headers,
            status: returnValue.status || 200
          });

          return ctx.res;

        case 'application/octet-stream':
          ctx.res = new Response(returnValue.Blob || '', {
            headers: returnValue.headers,
            status: returnValue.status || 200
          });

          return ctx.res;

        default:
          ctx.res = new Response(
            returnValue.interface ||
              returnValue.json ||
              returnValue.Blob ||
              returnValue.text,
            { headers: returnValue.headers, status: returnValue.status || 200 }
          );

          return ctx.res;
      }
    }

    return ctx.res;
  }

  public serveNodeHandler(
    ctx: Context,
    headers: { [key: string]: string },
    res: ServerResponse<IncomingMessage>
  ): boolean {
    const data = this.routes.get(ctx.method)?.find(ctx.path);
    console.log(data);
    if (!data) return false;

    ctx.params = data.params;

    const returnValue: EviateResponse = data.data.handler(ctx);
    if (!returnValue.headers) returnValue.headers = {};

    for (const header in headers) {
      returnValue.headers[header] = headers[header];
    }

    if (returnValue.text !== undefined && returnValue.json !== undefined) {
      throw new Error("You can't send both text and json object as response");
    }

    for (const headers in returnValue.headers) {
      res.setHeader(headers, returnValue.headers[headers]);
    }

    if (returnValue.error) {
      res.statusCode = returnValue.status || 404;
      res.end(JSON.stringify(returnValue.error));
      return true;
    }
    if (returnValue.headers) {
      switch (returnValue.headers['Content-type']) {
        case 'application/json':
          res.statusCode = returnValue.status || 200;
          res.end(JSON.stringify(returnValue.json));
          return true;

        case 'text/plain':
          res.statusCode = returnValue.status || 200;
          res.end(returnValue.text);

          return true;

        case 'application/octet-stream':
          res.statusCode = returnValue.status || 200;
          res.end(returnValue.Blob);
          return true;

        default:
          res.statusCode = returnValue.status || 200;
          res.end(
            returnValue.interface ||
              JSON.stringify(returnValue.json) ||
              returnValue.Blob ||
              returnValue.text
          );
          return true;
      }
    }
    return true;
  }

  public get plugin(): EviatePlugin {
    return this.plugin;
  }

  public on(name: string, callback: any) {
    switch (name) {
      case RouterEvent.Startup:
        this.event.on(name, callback);
        return;

      case RouterEvent.Shutdown:
        this.event.on(name, callback);
        return;

      case RouterEvent.BeforeRequest:
        this.event.on(name, callback);
        return;
      case RouterEvent.Mount:
        this.event.on(name, callback);
        return;
      case RouterEvent.Plugin:
        this.event.on(name, callback);
        return;

      default:
        throw new Error(`Event handler supports only:\n${allRouterEvents}`);
    }
  }

  public error(callback: (err: EngineError, ctx?: Context) => void) {
    this.event.on('err', callback);
  }
}
