import { Engine, Router } from '../src/core';
import { Context } from '../src/core/context';

const app = new Engine();
const router = new Router();

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

app.use('before', (ctx: Context): any => {
  console.log(ctx.path, ctx.method);

  return {
    ctx: ctx,
    header: { b: 'def' }
  };
});

app.use('before', (ctx: Context): any => {
  console.log(ctx.path, ctx.method);

  return {
    ctx: ctx,
    header: { c: 'no' }
  };
});

app.listen();
