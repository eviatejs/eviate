import { Engine } from '../core';

export async function loadConfig(app: Engine) {
  const loadedData =
    (await import(`${process.cwd()}/eviate.config.ts`)) ||
    import(`${process.cwd()}/eviate.config.js`);

  if (!loadedData) throw new Error('sunrit implement this');

  app.config = loadedData.default;
  console.log(app.config);
}
