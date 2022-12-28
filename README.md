<p align="center">
 <h2 align="center">Eviate JS (WIP)</h2>
 <p align="center">Next-generation web framework to build powerful apps</p>
</p>

## Features

- **Simple**: No more `req` or `res`. It's all `ctx` (context) and plain objects!
- **Fast**: Built from the ground up with performance in mind. Zero, Zilch, Nada dependencies.
- **Typescript-first**: Built with type-safety in mind, first-class support.
- **Flexible**: Completely flexible with access to the all events, and data.
- **Simple error handling**: No more try-catch all around. It's just eviate, you and a `onError` function here.
- **Middleware**: Powerful middleware support. Route-specific, Route-independent, aswell pre-request and post-request middlewares.
- **Plugins**: Built with user in mind, the best plugin support to make it super easy to ship anything.

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
    text: 'Hello world!'
  };
});

app.listen();
```

## Documentation

**Documentation WIP**

## 🤝 Contributing

Contributions, issues and feature requests are welcome. After cloning & setting up project locally, you can
just submit a PR to this repo, and it will be deployed once it's accepted.

⚠ It’s good to have descriptive commit messages, or PR titles so that other contributors can understand about your
commit or the PR Created. Read [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) before
making the commit message.

## Show your support

We love people's support in growing and improving. Be sure to drop a 🌟 if you like the project and
also be sure to contribute, if you're interested!

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

<div align="center">Made by EviateJS team with ❤</div>
