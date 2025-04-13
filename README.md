# Axenapi Ui

## Launch desktop/web app:

The application can be run as a desktop (dev/prod) or web(dev/prod) app.

- install npm from https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- `npm install --global yarn` - install yarn.
- `yarn` - install dependencies.
- `yarn start` - launch desktop app in dev mode with connection to cloud server.
- `yarn start:web` - launch web app on dev server (http://localhost:3000).
- `yarn build` - build production app version.
- `yarn build:dev` - build development app version.
- `yarn build:prod` - build production app version.

Build artifacts available at `dist/`.

## Compile desktop app distribution:

The app can be compile with connection to the cloud or local backend service. JDK and service .jar file are included in the distribution.

- `yarn package:local-server` | `yarn package:cloud-server` - package app into a platform-specific executable bundle with local or cloud server.
- `yarn make:local-server` | `yarn make:cloud-server` - make distributables for app with local or cloud server (in accordance with package).

Artifacts available at: `out/make`.

## for devops

1. get newest snapshot version of axenapi-web from nexux (version 1.0.0)
2. `yarn package:local-server`
3. `yarn make:local-server`
4. save Artifacts available at: `out/make` in nexus.

## Run E2E tests:

Test files directory: `/test/specs`

- `yarn package:cloud-server` - package app.
- `yarn test:e2e` - run all tests.

NOTE: to simplify writing e2e tests you can use `await page.pause()` inside your test.

## Run unit tests:

Test files directory: `*/__tests__`

- `yarn test` - run tests.

## Generate API:

- [Download](https://www.oracle.com/java/technologies/downloads/#java23) the latest Java
- `yarn generate-api` - run api generation

## Mutation testing

- `test:mutation` - run mutation testing
  The report is located in the directory: `/reports/mutation`
