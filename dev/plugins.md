The plugin would be based off a class for maximising the functionality.

```ts
import { Plugin, route } from 'eviate-plugin';

import type { PluginSettings, PluginError, PluginEvent } from 'eviate-plugin';

class MyPlugin extends Plugin {
  constructor() {
    super({
      name: 'my-plugin',
      version: '1.0.0',
      description: 'My plugin'
    });
  }

  // Property for plugin settings
  public get settings(): PluginSettings {
    return {
      loadOnce: true
    };
  }

  // Plugin events
  public async on(event: PluginEvent) {
    switch (event) {
      case 'startup':
        // Do something on startup
        this.emit('startup', 'My plugin started');
        break;
      case 'shutdown':
        // Do something on shutdown
        break;
    }
  }

  // Error streaming
  public async onError(err: PluginError) {
    // Do something with the error
    this.logger.error(err);
  }

  // Middlewares or routes that the plugin can create goes below.
  public async middleware(ctx: Context) {
    // Do something with the context
  }

  @route({
    method: 'GET',
    path: '/my-plugin'
  })
  public async route(ctx: Context) {
    // Do something with the context
  }
}
```

Once plugin is ready, it can be loaded using:

```ts
import { Eviate } from 'eviate';

import { MyPlugin } from './my-plugin';

const app = new Eviate();

app.plugins.load(new MyPlugin());
```
