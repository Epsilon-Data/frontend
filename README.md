# epsilon-frontend

Frontend for Epsilon secure research data platform

## Installation

### Prerequisites

Install `pnpm` and `typescript` globally

```bash
npm install -g typescript pnpm
```

When cloning the repo first time:

```bash
pnpm i # installs all dependent packages under node_modules
```

#### To go with the latest version please copy and past in your terminal the following steps

```
git clone https://github.com/Epsilon-Data/frontend.git epsilon-frontend && cd epsilon-frontend
```

Development mode

```
pnpm install && pnpm start
```

Production mode

```
pnpm install && pnpm build
```

#### How to analyze the bundle size

```
pnpm install && pnpm build --stats
```

And then use the [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) to open _build/bundle-stats.json_.

## Before raising PR

```bash
pnpm run clean-install # cleans cache, reinstalls and checks versions of packages
pnpm fix # runs lint and prettier
pnpm test # runs all unit tests for packages and services

```
