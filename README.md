<p align="center">
 <h2 align="center">Eviate JS (WIP)</h2>
 <p align="center">Next-gen web framework to build powerful apps</p>
</p>

## How are we next gen?

Here are some of the coolest stuff we've been shipping recently:

- **No more `req` or `res`**: Yes! this is the biggest one we're proud of. Finally, we've replaced `req` and `res`
  with context (`ctx`) to get data enough for you to get the request data. To make it simpler, the `res.send` or
  `res.json` or response returning is much more simpler. No more methods, return an object and we automagically
  convert it to the response you need.

- **First-class event handlers**: Event handlers a must to have fine-grained control over your app, and we
  understand that from out experience. We're providing you to register event handlers to control all kind of stuff
  going all over the app, eg. when your app starts, shuts down, pre-request, post-request, etc.

- **Global error handler**: It's super super tiring to add `try-catch` everywhere isn't it? We have converted raising
  errors to rather streaming them into a function where you can handle each of them peacefully.

- **First-class type-safe state**: It's super important to hold states such as your database connection, etc and
  it's even important for them to be type-safe. We've made it possible to hold states in a type-safe manner, and
  even access them from anywhere in your app.

- **URL redirection**: We realize remembering every type of route is actually hectic, like so much. So, we decided to
  simplify it. Here's how:

```ts
// There's 2 routes, `/home` and `/api/home` (namespaced under router called `api`).

// Redirect to home
return {
  redirect: app.url_for('home')
};

// Redirect to api home
return {
  redirect: app.url_for('api.home')
};

// You can even attach dynamic parameters
// eg. if your URL is `/hello/:num/profile/:name`
return {
  redirect: app.url_for('api.home', { num: 10, name: 'eviate' })
};
```

- **Flexible middlewares**: Using the new context pattern, we've adapted them to follow it. With no more `next`
  function, just modify and return context or a response, easy as that. To make it even better, middlewares can
  be now, pre-request, or post-request and will be called based on that.

## Getting started

### Installation and setup

One of the _quickest_ ways to get started is to use `create-eviate-app`.

Get started by scaffolding the app real quick using:

```ts
npx create-eviate-app
```

### Manual setup

If you want to setup the app manually, you can do so.

**NOTE**: Ensure you have bun installed (node is not yet supported).

Get started by quickly installing the dependencies.

```ts
bun install eviate
```

Now, create a file called `app.ts` and add the following code:

```ts
import { Engine } from 'eviate';

const app = new Engine();

app.get('/', ctx => {
  return {
    message: 'Hello world!'
  };
});

app.listen({
  port: 3000
});
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome. After cloning & setting up project locally, you can
just submit a PR to this repo, and it will be deployed once it's accepted.

⚠ It’s good to have descriptive commit messages, or PR titles so that other contributors can understand about your
commit or the PR Created. Read [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) before
making the commit message.

Find out more about our contributing guidelines [here](CONTRIBUTING.md).

## Show your support

We love people's support in growing and improving. Be sure to drop a 🌟 if you like the project and
also be sure to contribute, if you're interested!

<div align="center">Made by EviateJS team with ❤</div>
