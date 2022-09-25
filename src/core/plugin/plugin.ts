import { Plugin, PluginSettings } from 'eviate-plugin';
export class EviatePlugin {
  private plugin: Map<string, Plugin>;
  private pluginSettings: Map<string, PluginSettings>;

  constructor() {
    this.plugin = new Map();
    this.pluginSettings = new Map();
  }

  public setPlugin(plugin: Plugin) {
    this.setPluginSettings(plugin.pluginMetaData.title, plugin.settings);
    this.plugin.set(plugin.pluginMetaData.title, plugin);
  }

  public getPlugin(title: string): Plugin | undefined {
    return this.plugin.get(title);
  }

  public getAllPlugins(): Map<string, Plugin> {
    return this.plugin;
  }

  private setPluginSettings(title: string, settings: PluginSettings) {
    this.pluginSettings.set(title, Plugin);
  }

  public getSettings(title: string): PluginSettings | undefined {
    return this.pluginSettings.get(title);
  }
}
