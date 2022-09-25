import { Engine } from '../core';
import { existsSync } from 'fs';
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
  app.config?.startMiddlewares?.forEach(m => {
    app.use('before', m);
  });
  app.config?.endMiddlewares?.forEach(m => {
    app.use('after', m);
  });
  app.config?.plugins?.forEach(m => {
    app.plugin.setPlugin(m);
  });
  app.config?.routers?.forEach(m => {
    app.mount(m);
  });
}
