import {
  ReturnVal,
  Plugin,
  PluginSettings,
  RouteVal,
  MiddlewareVal
} from '@eviatejs/plugin';
import { Engine } from '../app';

export class EviatePlugin {
  private plugin: Map<string, Plugin>;
  private pluginSettings: PluginSettings[];
  private app: Engine;
  constructor(app: Engine) {
    this.app = app;
    this.plugin = new Map();
    this.pluginSettings = [];
  }

  public load(plugin: Plugin) {
    this.plugin.set(plugin.metadata.title, plugin);
  }

  public get(title: string): Plugin | undefined {
    return this.plugin.get(title);
  }

  public getAll(): Map<string, Plugin> {
    return this.plugin;
  }

  public settings(settings: PluginSettings) {
    this.pluginSettings.push(settings);
  }

  private saveRoutes(routes: RouteVal[]) {
    routes.forEach((val: RouteVal) => {
      this.app.register(val.method, val.path, val.handler);
    });
  }

  private saveMiddleware(middle: MiddlewareVal[]) {
    middle.forEach((val: MiddlewareVal) => {
      this.app.use(val.handler, val.position);
    });
  }

  public run() {
    const plug = this.getAll();
    plug.forEach((val: Plugin) => {
      const handler = val.handler();
      if (handler.routes.length != 0) this.saveRoutes(handler.routes);
      if (handler.middlewares.length != 0)
        this.saveMiddleware(handler.middlewares);
    });
  }
}
