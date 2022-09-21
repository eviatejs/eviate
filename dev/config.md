The configuration for an eviate app can be stored in `eviate.config.js` or `eviate.config.ts` in the root of the project. The config file should export a function that returns the config object.

```ts
import { NamePlugin } from 'eviate-plugin';

import type { EviateConfig } from 'eviate';

const config: EviateConfig = {
  port: 4000,
  hostname: 'localhost',
  development: true,
  state: {
    name: 'John Doe'
  },
  // Register plugins directly here
  plugins: [new NamePlugin('test')]
};

export default config;
```
