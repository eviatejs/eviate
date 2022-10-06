import {
  Plugin,
  PluginSettings,
  RouteValue,
  MiddlewareValue
} from '@eviatejs/plugin';

import { Engine } from '../app';

export class EviatePlugin {
  private app: Engine;
  private plugins: Map<string, Plugin>;
  private pluginSettings: PluginSettings[];

  constructor(app: Engine) {
    this.app = app;
    this.plugins = new Map();
    this.pluginSettings = [];
  }

  public load(plugin: Plugin) {
    this.plugins.set(plugin.metadata.title, plugin);
  }

  public get(title: string): Plugin | undefined {
    return this.plugins.get(title);
  }

  public getAll(): Map<string, Plugin> {
    return this.plugins;
  }

  public settings(settings: PluginSettings) {
    this.pluginSettings.push(settings);
  }

  private saveRoutes(routes: RouteValue[]) {
    routes.forEach((val: RouteValue) => {
      this.app.register(val.method, val.path, val.handler);
    });
  }

  private saveMiddleware(middle: MiddlewareValue[]) {
    middle.forEach((val: MiddlewareValue) => {
      this.app.use(val.handler, val.position);
    });
  }

  public run() {
    const plugins = this.getAll();

    plugins.forEach((plugin: Plugin) => {
      const handler = plugin.handler();

      if (handler.routes.length != 0) this.saveRoutes(handler.routes);
      if (handler.middlewares.length != 0)
        this.saveMiddleware(handler.middlewares);
    });
  }
}
