import { Engine, Router } from '../src';

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
    text: 'Hi'
  };
});

// Router routes
router.get('/hello', ctx => {
  console.log(ctx.host);

  return { text: 'Router Works' };
});

// Implement the router
app.use(router);

app.listen(3000);
