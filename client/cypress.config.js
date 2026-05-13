import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // The app must be running at this URL before tests execute
    baseUrl: 'http://localhost:5173',

    // Give Atlas a bit more time to respond
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    // Keep videos off to speed up local runs
    video: false,
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      // No custom node events needed for now
    },
  },
});
