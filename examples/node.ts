const { Engine, Router } = require('../dist/index');

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

// App routes
app.get('/', (ctx: any) => {
  console.log(ctx.method);
  return {
    text: 'Hi',
    headers: { a: 'xyz' }
  };
});

app.get('/html', (ctx: any) => {
  return {
    interface: '<h1>Hi</h1>',
    headers: { 'Content-Type': 'text/html' }
  };
});

// Router routes
router.post('/hello', (ctx: any) => {
  console.log(ctx.host);

  return { text: 'Router Works' };
});

app.put('/put', (_: any) => {
  return {};
});

app.delete('/delete', (_: any) => {
  return {};
});

app.head('/head', (_: any) => {
  return {};
});

app.options('/options', (_: any) => {
  return {};
});

app.patch('/patch', (_: any) => {
  return {};
});

// Implement the router
app.mount(router);

app.listen();
