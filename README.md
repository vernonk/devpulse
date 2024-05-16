# DevPulse

DevPulse is an app that allows users to stay on the pulse of their developer activities and visualize their progress over time. The application is built using the [Remix](https://remix.run) framework and [Vite](https://vitejs.dev) build tool.

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
