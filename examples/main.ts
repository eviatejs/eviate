import { Engine, Router } from '../src';

const app = new Engine({});
const router = new Router();
app.get('/', ctx => {
  console.log(ctx.method);
  return {
    text: 'Hello'
  };
});

router.get('/hello', ctx => {
  console.log(ctx.host);
  return { text: 'Router Works' };
});

app.use(router);
app.listen();
//Implement logic
