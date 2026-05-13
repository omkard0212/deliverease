// ─── Customer Flow Tests ──────────────────────────────────────────────────────
// Covers: dashboard, order list, tracking page, map, status timeline

describe('Customer Flow', () => {
  beforeEach(() => {
    cy.loginAsCustomer();
  });

  // ── Dashboard ──────────────────────────────────────────────────────────────
  describe('Customer Dashboard', () => {
    it('lands on /customer/dashboard after login', () => {
      cy.url().should('include', '/customer/dashboard');
    });

    it('shows the page heading', () => {
      cy.contains('My Orders').should('be.visible');
    });

    it('shows the navbar with correct role links', () => {
      cy.contains('My Orders').should('be.visible'); // nav link
      cy.contains('DeliverEase').should('be.visible'); // logo
    });

    it('displays order cards for the logged-in customer', () => {
      // customer1 has 2 orders in the seed data
      cy.get('[class*="rounded-xl"]').should('have.length.at.least', 1);
    });

    it('each order card shows a tracking ID', () => {
      // Tracking IDs start with DE-
      cy.contains(/DE-[A-Z0-9]{6}/).should('exist');
    });

    it('each order card has a "Track Live" button', () => {
      cy.contains('Track Live').should('exist');
    });

    it('shows a status badge on each order', () => {
      // Status badges contain one of the known statuses
      cy.contains(/Pending|Assigned|Picked Up|In Transit|Delivered/).should('exist');
    });
  });

  // ── Tracking Page ──────────────────────────────────────────────────────────
  describe('Order Tracking Page', () => {
    it('navigates to the tracking page when "Track Live" is clicked', () => {
      cy.contains('Track Live').first().click();
      cy.url().should('match', /\/track\/DE-[A-Z0-9]{6}/);
    });

    it('shows the package description on the tracking page', () => {
      cy.contains('Track Live').first().click();
      // Package description should be visible in the header
      cy.get('h1').should('not.be.empty');
    });

    it('renders the Leaflet map container', () => {
      cy.contains('Track Live').first().click();
      // Leaflet always renders a div with class leaflet-container
      cy.get('.leaflet-container', { timeout: 8000 }).should('be.visible');
    });

    it('shows the delivery progress timeline', () => {
      cy.contains('Track Live').first().click();
      cy.contains('Delivery Progress').should('be.visible');
      cy.contains('Order Placed').should('be.visible');
      cy.contains('Delivered').should('be.visible');
    });

    it('shows order details section', () => {
      cy.contains('Track Live').first().click();
      cy.contains('Order Details').should('be.visible');
      cy.contains('Pickup').should('be.visible');
      cy.contains('Delivery').should('be.visible');
    });

    it('shows the tracking ID in the header', () => {
      cy.contains('Track Live').first().click();
      cy.contains(/DE-[A-Z0-9]{6}/).should('be.visible');
    });
  });

  // ── Public Tracking (no login required) ───────────────────────────────────
  describe('Public tracking via URL', () => {
    it('shows an error for an invalid tracking ID', () => {
      cy.visit('/track/DE-INVALID');
      cy.contains(/not found|check your tracking/i).should('be.visible');
    });
  });
});
