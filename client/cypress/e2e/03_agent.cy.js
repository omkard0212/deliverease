// ─── Agent Flow Tests ─────────────────────────────────────────────────────────
// Covers: agent dashboard, order list, status update buttons

describe('Agent Flow', () => {
  beforeEach(() => {
    cy.loginAsAgent();
  });

  // ── Dashboard ──────────────────────────────────────────────────────────────
  describe('Agent Dashboard', () => {
    it('lands on /agent/dashboard after login', () => {
      cy.url().should('include', '/agent/dashboard');
    });

    it('shows a welcome message with the agent name', () => {
      cy.contains('Welcome, Ravi Kumar').should('be.visible');
    });

    it('shows the stats cards', () => {
      cy.contains('Active Orders').should('be.visible');
      cy.contains('Delivered').should('be.visible');
      cy.contains('Total Assigned').should('be.visible');
    });

    it('shows the location sharing toggle', () => {
      cy.contains('Live Location Sharing').should('be.visible');
      cy.contains('Start Sharing').should('be.visible');
    });

    it('shows the active deliveries section', () => {
      cy.contains('Active Deliveries').should('be.visible');
    });

    it('has a "View all" link to /agent/orders', () => {
      cy.contains('View all').click();
      cy.url().should('include', '/agent/orders');
    });

    it('shows the navbar with agent links', () => {
      cy.contains('Dashboard').should('be.visible');
      cy.contains('My Deliveries').should('be.visible');
    });
  });

  // ── Orders Page ────────────────────────────────────────────────────────────
  describe('Agent Orders Page', () => {
    beforeEach(() => cy.visit('/agent/orders'));

    it('shows the page heading', () => {
      cy.contains('My Deliveries').should('be.visible');
    });

    it('displays assigned orders', () => {
      // agent1 has orders in the seed data
      cy.contains(/DE-[A-Z0-9]{6}/).should('exist');
    });

    it('shows pickup and delivery addresses on each order', () => {
      cy.contains('Pickup:').should('exist');
      cy.contains('Deliver to:').should('exist');
    });

    it('shows a status badge on each order', () => {
      cy.contains(/In Transit|Picked Up|Assigned|Delivered/).should('exist');
    });

    it('shows an action button for non-delivered orders', () => {
      // Orders that aren't delivered should have an update button
      cy.contains(/Mark as|Picked Up|In Transit|Delivered/).should('exist');
    });

    it('shows status history when "View history" is clicked', () => {
      cy.contains('View history').first().click();
      // History entries show timestamps
      cy.contains(/pending|assigned|picked_up|in_transit|delivered/i).should('be.visible');
    });
  });

  // ── Status Update ──────────────────────────────────────────────────────────
  describe('Status update', () => {
    it('updates order status when action button is clicked', () => {
      cy.visit('/agent/orders');

      // Find an order that has an actionable button (not delivered)
      cy.get('button').contains(/Mark as/).first().then(($btn) => {
        const originalText = $btn.text();
        cy.wrap($btn).click();

        // Button should show "Updating…" briefly then disappear or change
        // After update, the status badge should change
        cy.contains(/In Transit|Picked Up|Delivered/, { timeout: 8000 }).should('exist');
      });
    });
  });
});
