import { Engine, Router } from '../src';

const app = new Engine({});
const router = new Router();
app.get('/', ctx => {
  console.log(ctx.method);

  return {
    text: 'Hi'
  };
});

router.get('/hello', ctx => {
  console.log(ctx.host);
  return { text: 'Router Works' };
});

app.use(router);
app.on('startup', () => {
  console.log("IT'S STARTING AYO LOL");
});

app.on('beforeRequest', () => {
  console.log('Running pre request function');
});

app.error((err, ctx) => {
  console.log(err.message);
  console.log(ctx?.path);
});

app.listen(3000);
//Implement logic
