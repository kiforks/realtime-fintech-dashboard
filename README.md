# Realtime Fintech Dashboard

A small Angular application with a live market dashboard and data-producer settings. Simulated market updates come
from a WebAssembly library written in Rust that runs inside a Web Worker.

**Live demo:** https://kiforks.github.io/realtime-fintech-dashboard/

> Work in progress. The sections below grow with each delivery stage.

## Tech stack

- Angular 22 (zoneless, signals, standalone components), TypeScript 6
- Vitest 5 through the Angular CLI unit-test builder, Angular CDK component harnesses
- ESLint, Prettier and Stylelint with the `@kiforks/*` shared configs, husky and lint-staged
- GitHub Actions: every push runs lint, tests and a production build; every push to `main` deploys to GitHub Pages

## Getting started

Requirements: Node.js 24 (see `.nvmrc`) and npm.

```bash
npm ci
npm start
```

The development server runs at http://localhost:4200/.

## Scripts

| Script             | What it does                                            |
| ------------------ | ------------------------------------------------------- |
| `npm start`        | Development server with live reload                     |
| `npm run build`    | Production build into `dist/realtime-fintech-dashboard` |
| `npm test`         | Unit tests (add `-- --coverage` for a coverage report)  |
| `npm run lint`     | ESLint, Stylelint and Prettier checks                   |
| `npm run lint:fix` | The same checks with automatic fixes                    |

## Project structure

```
src/
  app/        bootstrap: main.ts, app.config.ts, index.html
  pages/      root shell (navigation + router outlet) and routes
  modules/    feature modules, e.g. market/pages
  shared/     cross-cutting code: global styles and theme tokens
```
