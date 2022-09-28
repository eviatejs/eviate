const { Engine } = require('../dist/index');

const app = new Engine();

app.on('startup', () => {
  console.log('Startup working');
});

app.get('/', ctx => {
  console.log(ctx.method);

  return {
    text: 'Hi',
    headers: { a: 'xyz' }
  };
});

app.get('/json', _ => {
  return {
    json: { a: 'xyz' },
    headers: { 'Content-Type': 'application/json' }
  };
});
