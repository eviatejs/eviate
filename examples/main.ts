import { Engine, Router } from '../src';
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

// app.on('unsupported-method', () => {
//   console.log('Unsupported method');
// });

// Error handler
app.error((err, ctx) => {
  console.log(err.message);
  console.log(ctx?.path);
});

// App routes
app.get('/', ctx => {
  console.log(ctx.method);
  return {
    text: 'Hi'
  };
});
// Router routes
router.post('/hello', ctx => {
  console.log(ctx.host);
  return { text: 'Router Works' };
});

app.put('/put', ctx => {
  return {};
});

app.delete('/delete', ctx => {
  return {};
});

app.head('/head', ctx => {
  return {};
});

app.options('/options', ctx => {
  return {};
});

app.patch('/patch', ctx => {
  return {};
});

// Implement the router
app.register(router);
app.use('start', (ctx: Context): Context => {
  console.log(ctx.path);
  return ctx;
});

app.listen({ port: 4000 });
