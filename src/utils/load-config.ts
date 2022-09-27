import { existsSync } from 'fs';

import type { Engine } from '../core';

export async function loadConfig(app: Engine) {
  let loadedData;
  if (existsSync(`${process.cwd()}/eviate.config.ts`))
    loadedData = await import(`${process.cwd()}/eviate.config.ts`);
  if (existsSync(`${process.cwd()}/eviate.config.js`))
    loadedData = await import(`${process.cwd()}/eviate.config.js`);

  if (!loadedData) {
    app.config = undefined;
    return;
  }

  app.config = loadedData.default;

  // Load the middlewares (if any)
  app.config?.startMiddlewares?.forEach(handler => {
    app.use(handler, 'before');
  });
  app.config?.endMiddlewares?.forEach(handler => {
    app.use(handler, 'after');
  });

  // Load plugins (if any)
  app.config?.plugins?.forEach(plugin => {
    app.plugin.load(plugin);
  });

  // Load the routes (if any)
  app.config?.routers?.forEach(route => {
    app.mount(route);
  });
}
