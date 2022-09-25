import { Engine } from '../core';

export async function loadConfig(app: Engine) {
  const loadedData =
    (await import(`${process.cwd()}/eviate.config.ts`)) ||
    import(`${process.cwd()}/eviate.config.js`);

  if (!loadedData) app.config = undefined;

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
