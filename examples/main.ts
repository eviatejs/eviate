import { Engine, Router } from '../src/core';
import { Context } from '../src/core/context';
import {
  MiddlewareVal,
  Plugin,
  PluginSettings,
  ReturnVal,
  RouteVal
} from '@eviatejs/plugin';
import { EviateResponse } from '../src/interfaces';
const app = new Engine();
const router = new Router();

class abc extends Plugin {
  routes: RouteVal[];
  middleware: MiddlewareVal[];
  constructor() {
    super({
      title: 'abc',
      description: '',
      version: '1.0'
    });
    this.routes = [];
    this.middleware = [];
  }
  handler(): ReturnVal {
    this.routes.push({
      method: 'GET',
      path: '/routes/oof',
      handler: (ctx: Context): EviateResponse => {
        return {};
      }
    });
    const returnVal: ReturnVal = {
      routes: this.routes,
      middlewares: this.middleware
    };
    return returnVal;
  }
  get settings(): PluginSettings {
    return {};
  }
}
app.plugin.load(new abc());
app.plugin.run();
// Event Handlers
app.on('startup', () => {
  console.log('Startup working');
});

app.on('before-request', () => {
  console.log('Running pre request function');
});

// Error handler
app.error((err, ctx) => {
  console.log(err.message);
  console.log(ctx?.path);
});

// App routes
app.get('/', ctx => {
  console.log(ctx.method);
  return {
    text: 'Hi',
    headers: { a: 'xyz' }
  };
});

app.get('/html', _ => {
  return {
    interface: '<h1>Hi</h1>',
    headers: { 'Content-Type': 'text/html' }
  };
});

// Router routes
router.post('/hello', ctx => {
  console.log(ctx.host);

  return { text: 'Router Works' };
});

app.put('/put', _ => {
  return {};
});

app.delete('/delete', _ => {
  return {};
});

app.head('/head', _ => {
  return {};
});

app.options('/options', _ => {
  return {};
});

app.patch('/patch', _ => {
  return {};
});

// Implement the router
app.mount(router);

app.use((ctx: Context): any => {
  console.log(ctx.path, ctx.method);

  return {
    ctx: ctx,
    header: { b: 'def' }
  };
}, 'before');

app.use((ctx: Context): any => {
  console.log(ctx.path, ctx.method);

  return {
    ctx: ctx,
    header: { c: 'no' }
  };
}, 'before');

app.listen('node');
