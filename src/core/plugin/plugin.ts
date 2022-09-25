import type { Context } from '../context';
import type { handler } from '../../interfaces';
import { Plugin, PluginSettings } from 'eviate-plugin';
export class EviatePlugin {
  private plugin: Map<string, Plugin>;
  private pluginSettings: PluginSettings[];

  constructor() {
    this.plugin = new Map();
    this.pluginSettings = [];
  }
}
