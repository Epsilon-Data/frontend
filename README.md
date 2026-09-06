# epsilon-frontend

Frontend for Epsilon secure research data platform

Originally setup using [lightence-ant-design-react-template](https://github.com/altence/lightence-ant-design-react-template)

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

## End-to-end tests (Cypress)

The e2e suite lives in `cypress/e2e` (projects, datasets, archetypes) and drives the real application through the browser, including the Keycloak login flow.

### Prerequisites

The full local stack must be running before starting Cypress:

1. **Frontend dev server** on `http://localhost:3000` — `pnpm start`
2. **Platform API + Keycloak** reachable on `http://localhost` (API at `http://localhost/api/v1`) — see the [platform repo](https://github.com/Epsilon-Data/platform) for bringing the stack up
3. **Docker** with the platform Postgres container running as `pg_platform` — the suite's cleanup task runs `docker exec pg_platform psql ...` to delete projects created during the tests

### Credentials

Test users and inputs are read from Cypress env. Create a `cypress.env.json` in the repo root (it is gitignored — never commit real credentials):

```json
{
  "owner_username": "...",
  "owner_password": "...",
  "researcher_username": "...",
  "researcher_password": "...",
  "admin_username": "...",
  "admin_password": "...",
  "databaseURL": "postgresql://user:password@host:5432/db"
}
```

The users must exist in your local Keycloak realm with the matching roles. `databaseURL` is a reachable Postgres used by the create-project tests. In CI the same values can be provided as `CYPRESS_owner_username` etc. environment variables instead of the file.

### Running

```bash
pnpm cy:open # interactive runner (pick specs, watch the browser)
pnpm cy:run  # headless, all specs — use this in CI
```

Run a single spec headlessly:

```bash
pnpm cy:run --spec cypress/e2e/projects/create-project.cy.ts
```

### Notes

- `chromeWebSecurity` is disabled and `experimentalModifyObstructiveThirdPartyCode` enabled in `cypress.config.ts` — required for the cross-origin Keycloak SSO redirect. Don't "fix" these.
- After specs complete, the cleanup task deletes projects whose name contains `TEST` or `CYPRESS` from the platform database — name test fixtures accordingly, and avoid those words in projects you want to keep.
- Video recording is off; screenshots are captured on failure under `cypress/screenshots`.
- Cypress env values are hard-coded in `cypress.config.ts` (they can't be shared with Vite's `import.meta.env`) — if your stack runs on different ports, adjust `baseUrl`/`apiPrefix` there.

