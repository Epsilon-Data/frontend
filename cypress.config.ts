import { defineConfig } from 'cypress';
import config from './src/config/config';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
    supportFile: 'cypress/support/e2e.ts',

    // cross-origin testing for keycloak SSO
    experimentalModifyObstructiveThirdPartyCode: true,
    chromeWebSecurity: false,
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
      // cleanup task which deletes test projects created during e2e tests to not bloat the database and screen
      on('task', {
        async cleanupTestProjects() {
          const { exec } = require('child_process');
          return new Promise((resolve, reject) => {
            // Increased timeout to 10 seconds for the exec command
            exec(
              'docker exec pg_platform psql -U epsilon_admin -d epsilon -c "DELETE FROM \\"Project\\" WHERE upper(name) LIKE \'%TEST%\' OR upper(name) LIKE \'%CYPRESS%\';"',
              { timeout: 10000 },
              (error: Error | null, stdout: string, stderr: string) => {
                if (error) {
                  console.error(`Error executing cleanup: ${error.message}`);
                  reject(error);
                  return;
                }
                console.log(`Cleanup result: ${stdout}`);
                if (stderr) console.error(`stderr: ${stderr}`);
                resolve(null);
              },
            );
          });
        },
      });
    },
  },

  // global options
  video: false,
  screenshotOnRunFailure: true,
});
