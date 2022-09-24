import { Engine } from '../core';

export async function loadConfig(app: Engine) {
  const loadedData =
    (await import(`${process.cwd()}/eviate.config.ts`)) ||
    import(`${process.cwd()}/eviate.config.js`);

  if (!loadedData) app.config = undefined;

  app.config = loadedData.default;
}
