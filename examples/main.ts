import { Engine } from '../src';

const app = new Engine({});

app.get('/', ctx => {
  console.log(ctx.method);
  return 'Works omg';
});

app.get('/user/:name', ctx => {
  return ctx.params.name;
});

app.listen();
//Implement logic
