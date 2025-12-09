import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    env: {
      // i dont have an env yet
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  // global options
  video: false,
  screenshotOnRunFailure: true,
});
