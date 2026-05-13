// ─── Admin Flow Tests ─────────────────────────────────────────────────────────
// Covers: admin dashboard, stats, orders table, create order form, assign agent

describe('Admin Flow', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  // ── Dashboard ──────────────────────────────────────────────────────────────
  describe('Admin Dashboard', () => {
    it('lands on /admin/dashboard after login', () => {
      cy.url().should('include', '/admin/dashboard');
    });

    it('shows the dashboard heading', () => {
      cy.contains('Admin Dashboard').should('be.visible');
    });

    it('shows the 4 stats cards', () => {
      cy.contains('Total Orders').should('be.visible');
      cy.contains('Pending').should('be.visible');
      cy.contains('In Transit').should('be.visible');
      cy.contains('Delivered').should('be.visible');
    });

    it('stats show numeric values', () => {
      // Each stat card should contain a number
      cy.contains('Total Orders')
        .parent()
        .find('p.text-3xl')
        .invoke('text')
        .then((text) => {
          expect(Number(text)).to.be.at.least(0);
        });
    });

    it('shows the tab switcher', () => {
      cy.contains('All Orders').should('be.visible');
      cy.contains('+ Create Order').should('be.visible');
    });
  });

  // ── Orders Table ───────────────────────────────────────────────────────────
  describe('Orders table', () => {
    it('shows the orders table with column headers', () => {
      cy.contains('Tracking ID').should('be.visible');
      cy.contains('Customer').should('be.visible');
      cy.contains('Status').should('be.visible');
      cy.contains('Agent').should('be.visible');
    });

    it('shows at least one order row', () => {
      cy.contains(/DE-[A-Z0-9]{6}/).should('exist');
    });

    it('shows status badges in the table', () => {
      cy.contains(/Pending|Assigned|Picked Up|In Transit|Delivered/).should('exist');
    });
  });

  // ── Create Order Form ──────────────────────────────────────────────────────
  describe('Create Order form', () => {
    beforeEach(() => {
      cy.contains('+ Create Order').click();
    });

    it('shows the create order form when tab is clicked', () => {
      cy.contains('New Order').should('be.visible');
      cy.contains('Package Description').should('be.visible');
      cy.contains('Pickup City').should('be.visible');
      cy.contains('Delivery City').should('be.visible');
    });

    it('shows an error when pickup and delivery cities are the same', () => {
      // Select a customer first
      cy.get('select[name="customerId"]').select(1); // pick first option

      cy.get('input[name="packageDescription"]').type('Test Package');

      // Pick the same city for both
      cy.get('select[name="pickupCity"]').select('Mumbai, Maharashtra');
      cy.get('select[name="deliveryCity"]').select('Mumbai, Maharashtra');

      cy.get('button[type="submit"]').click();
      cy.contains('Pickup and delivery cities must be different').should('be.visible');
    });

    it('shows an error when no customer is selected', () => {
      cy.get('input[name="packageDescription"]').type('Test Package');
      cy.get('select[name="pickupCity"]').select('Mumbai, Maharashtra');
      cy.get('select[name="deliveryCity"]').select('New Delhi, Delhi');
      cy.get('button[type="submit"]').click();
      // HTML5 required validation on the customer select
      cy.get('select[name="customerId"]:invalid').should('exist');
    });

    it('city dropdowns contain Indian cities', () => {
      cy.get('select[name="pickupCity"]').within(() => {
        cy.contains('Mumbai, Maharashtra').should('exist');
        cy.contains('New Delhi, Delhi').should('exist');
        cy.contains('Bengaluru, Karnataka').should('exist');
      });
    });
  });

  // ── Assign Agent ───────────────────────────────────────────────────────────
  describe('Assign agent', () => {
    it('shows the All Orders tab with an orders table', () => {
      // Make sure we are on the All Orders tab
      cy.contains('All Orders').click();
      // The table should always have at least the header row
      cy.contains('Tracking ID').should('be.visible');
      cy.contains('Assign Agent').should('be.visible');
    });
  });

  // ── Navigation ─────────────────────────────────────────────────────────────
  describe('Navigation', () => {
    it('shows Admin Panel link in navbar', () => {
      cy.contains('Admin Panel').should('be.visible');
    });

    it('switches between All Orders and Create Order tabs', () => {
      cy.contains('+ Create Order').click();
      cy.contains('New Order').should('be.visible');

      cy.contains('All Orders').click();
      cy.contains('Tracking ID').should('be.visible');
    });
  });
});
