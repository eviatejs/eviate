import { Plugin, PluginSettings } from 'eviate-plugin';
export class EviatePlugin {
  private plugin: { [key: string]: Plugin };
  private pluginSettings: PluginSettings[];

  constructor() {
    this.plugin = {};
    this.pluginSettings = [];
  }

  public setPlugin(plugin: Plugin) {
    this.plugin[plugin.metadata.title] = plugin;
  }

  public getPlugin(title: string): Plugin | undefined {
    return this.plugin[title];
  }

  public getAllPlugins(): { [key: string]: Plugin } {
    return this.plugin;
  }

  public setPluginSettings(settings: PluginSettings) {
    this.pluginSettings.push(settings);
  }
}
