import { defineConfig } from 'cypress';
import config from './src/config/config';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    env: {
      // not sure if this is needed since theres cypress.env.json, but i think its better than putting everything in cypress.env.json for the conditional logic
      isDev: config.isDev,
      baseUrl: config.baseUrl,
      apiPrefix: config.apiPrefix,
      cookiePrefix: config.cookiePrefix,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  // global options
  video: false,
  screenshotOnRunFailure: true,
});
