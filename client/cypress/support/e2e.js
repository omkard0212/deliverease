// This file runs before every test suite.
// Import custom commands so they're available everywhere.
import './commands';

// Suppress uncaught exceptions from the app that would otherwise fail tests
// (e.g. socket.io connection errors when the backend is slow)
Cypress.on('uncaught:exception', (err) => {
  // Return false to prevent Cypress from failing the test
  if (err.message.includes('socket') || err.message.includes('ResizeObserver')) {
    return false;
  }
});
