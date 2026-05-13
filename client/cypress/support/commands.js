// ─── Custom Cypress Commands ──────────────────────────────────────────────────
// These commands are available in every test file via cy.xxx()

/**
 * cy.login(email, password)
 * Fills the login form and submits it.
 * Waits for a redirect away from /login before resolving.
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  // Wait until we've left the login page
  cy.url().should('not.include', '/login');
});

/**
 * cy.loginAsAdmin()
 * cy.loginAsAgent()
 * cy.loginAsCustomer()
 * Convenience wrappers using the seeded demo credentials.
 */
Cypress.Commands.add('loginAsAdmin',    () => cy.login('admin@test.com',     'password123'));
Cypress.Commands.add('loginAsAgent',    () => cy.login('agent1@test.com',    'password123'));
Cypress.Commands.add('loginAsCustomer', () => cy.login('customer1@test.com', 'password123'));

/**
 * cy.logout()
 * Clicks the Logout button in the navbar.
 */
Cypress.Commands.add('logout', () => {
  cy.contains('button', 'Logout').click();
  cy.url().should('include', '/login');
});
