// ─── Authentication Tests ─────────────────────────────────────────────────────
// Covers: login, register, logout, role-based redirects, route protection

describe('Authentication', () => {
  // ── Login ──────────────────────────────────────────────────────────────────
  describe('Login page', () => {
    beforeEach(() => cy.visit('/login'));

    it('renders the login form', () => {
      cy.contains('DeliverEase').should('be.visible');
      cy.get('#email').should('exist');
      cy.get('#password').should('exist');
      cy.get('button[type="submit"]').contains('Sign In').should('be.visible');
    });

    it('shows an error for wrong credentials', () => {
      cy.get('#email').type('wrong@test.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.contains('Invalid email or password').should('be.visible');
    });

    it('shows an error when fields are empty', () => {
      // HTML5 validation prevents submit — email field should be invalid
      cy.get('button[type="submit"]').click();
      cy.get('#email:invalid').should('exist');
    });

    it('redirects admin to /admin/dashboard after login', () => {
      cy.get('#email').type('admin@test.com');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/admin/dashboard');
    });

    it('redirects agent to /agent/dashboard after login', () => {
      cy.get('#email').type('agent1@test.com');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/agent/dashboard');
    });

    it('redirects customer to /customer/dashboard after login', () => {
      cy.get('#email').type('customer1@test.com');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/customer/dashboard');
    });
  });

  // ── Register ───────────────────────────────────────────────────────────────
  describe('Register page', () => {
    beforeEach(() => cy.visit('/register'));

    it('renders the registration form', () => {
      cy.contains('Create Account').should('be.visible');
      cy.get('#name').should('exist');
      cy.get('#email').should('exist');
      cy.get('#password').should('exist');
    });

    it('shows error when password is too short', () => {
      cy.get('#name').type('Test User');
      cy.get('#email').type('newuser@test.com');
      cy.get('#password').type('123'); // less than 6 chars
      cy.get('button[type="submit"]').click();
      cy.contains('Password must be at least 6 characters').should('be.visible');
    });

    it('has a link to the login page', () => {
      cy.contains('Sign in').click();
      cy.url().should('include', '/login');
    });
  });

  // ── Logout ─────────────────────────────────────────────────────────────────
  describe('Logout', () => {
    it('logs out and redirects to /login', () => {
      cy.loginAsCustomer();
      cy.logout();
      cy.url().should('include', '/login');
    });

    it('clears the token from localStorage on logout', () => {
      cy.loginAsCustomer();
      cy.logout();
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });
  });

  // ── Route Protection ───────────────────────────────────────────────────────
  describe('Protected routes', () => {
    it('redirects unauthenticated user from /customer/dashboard to /login', () => {
      cy.visit('/customer/dashboard');
      cy.url().should('include', '/login');
    });

    it('redirects unauthenticated user from /admin/dashboard to /login', () => {
      cy.visit('/admin/dashboard');
      cy.url().should('include', '/login');
    });

    it('redirects unauthenticated user from /agent/dashboard to /login', () => {
      cy.visit('/agent/dashboard');
      cy.url().should('include', '/login');
    });

    it('redirects customer away from /admin/dashboard', () => {
      cy.loginAsCustomer();
      cy.visit('/admin/dashboard');
      // Should be redirected to their own dashboard, not admin
      cy.url().should('include', '/customer/dashboard');
    });

    it('redirects agent away from /admin/dashboard', () => {
      cy.loginAsAgent();
      cy.visit('/admin/dashboard');
      cy.url().should('include', '/agent/dashboard');
    });
  });
});
