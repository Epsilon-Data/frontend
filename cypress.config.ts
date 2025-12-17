import { defineConfig } from 'cypress';
import config from './src/config/config';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    env: {
      // can't use values from config.ts due to config.ts using import.meta.env,
      // so just hard code it and change manually if needed
      // TODO: find a way to share env variables between cypress and vite, if cant then leave it be
      isDev: true,
      baseUrl: 'http://localhost',
      apiPrefix: 'http://localhost/api/v1',
      cookiePrefix: 'epsilon',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  // global options
  video: false,
  screenshotOnRunFailure: true,
});
