## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

### Docker Compose

Build and start the production container:

```bash
docker compose up -d --build
```

The app is available at [http://localhost:3000](http://localhost:3000). To use a
different host port, set `APP_PORT` when starting it:

```bash
APP_PORT=8080 docker compose up -d --build
```

Stop the container with `docker compose down`. The image uses an unprivileged
Nginx server and includes a Docker health check.

## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
