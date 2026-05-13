// ─── API / Network Tests ──────────────────────────────────────────────────────
// Uses cy.request() to test the backend REST API directly (no UI needed).
// The backend must be running at http://localhost:5001

const API = 'http://localhost:5001/api';

describe('Backend API', () => {
  // ── Health Check ───────────────────────────────────────────────────────────
  it('GET / returns a running message', () => {
    cy.request('GET', 'http://localhost:5001/').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.include('running');
    });
  });

  // ── Auth Endpoints ─────────────────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('returns 200 and a token for valid credentials', () => {
      cy.request('POST', `${API}/auth/login`, {
        email: 'admin@test.com',
        password: 'password123',
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('token');
        expect(res.body.user.role).to.eq('admin');
      });
    });

    it('returns 401 for wrong password', () => {
      cy.request({
        method: 'POST',
        url: `${API}/auth/login`,
        body: { email: 'admin@test.com', password: 'wrongpassword' },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.include('Invalid');
      });
    });

    it('returns 400 when fields are missing', () => {
      cy.request({
        method: 'POST',
        url: `${API}/auth/login`,
        body: { email: 'admin@test.com' }, // no password
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns user profile with a valid token', () => {
      // First login to get a token
      cy.request('POST', `${API}/auth/login`, {
        email: 'customer1@test.com',
        password: 'password123',
      }).then((loginRes) => {
        const token = loginRes.body.token;

        cy.request({
          method: 'GET',
          url: `${API}/auth/me`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.user.email).to.eq('customer1@test.com');
          expect(res.body.user.role).to.eq('customer');
        });
      });
    });

    it('returns 401 without a token', () => {
      cy.request({
        method: 'GET',
        url: `${API}/auth/me`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  // ── Order Endpoints ────────────────────────────────────────────────────────
  describe('GET /api/orders/my', () => {
    it('returns orders for the logged-in customer', () => {
      cy.request('POST', `${API}/auth/login`, {
        email: 'customer1@test.com',
        password: 'password123',
      }).then((loginRes) => {
        cy.request({
          method: 'GET',
          url: `${API}/orders/my`,
          headers: { Authorization: `Bearer ${loginRes.body.token}` },
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.at.least(1);
        });
      });
    });

    it('returns 403 when an agent tries to access /orders/my', () => {
      cy.request('POST', `${API}/auth/login`, {
        email: 'agent1@test.com',
        password: 'password123',
      }).then((loginRes) => {
        cy.request({
          method: 'GET',
          url: `${API}/orders/my`,
          headers: { Authorization: `Bearer ${loginRes.body.token}` },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(403);
        });
      });
    });
  });

  describe('GET /api/orders/track/:trackingId', () => {
    it('returns order data for a valid tracking ID', () => {
      // First get a real tracking ID from the customer orders
      cy.request('POST', `${API}/auth/login`, {
        email: 'customer1@test.com',
        password: 'password123',
      }).then((loginRes) => {
        cy.request({
          method: 'GET',
          url: `${API}/orders/my`,
          headers: { Authorization: `Bearer ${loginRes.body.token}` },
        }).then((ordersRes) => {
          const trackingId = ordersRes.body[0].trackingId;

          // Track endpoint is public — no auth needed
          cy.request('GET', `${API}/orders/track/${trackingId}`).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.trackingId).to.eq(trackingId);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('statusHistory');
          });
        });
      });
    });

    it('returns 404 for a non-existent tracking ID', () => {
      cy.request({
        method: 'GET',
        url: `${API}/orders/track/DE-FAKEID`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  describe('GET /api/orders (admin only)', () => {
    it('returns all orders for admin', () => {
      cy.request('POST', `${API}/auth/login`, {
        email: 'admin@test.com',
        password: 'password123',
      }).then((loginRes) => {
        cy.request({
          method: 'GET',
          url: `${API}/orders`,
          headers: { Authorization: `Bearer ${loginRes.body.token}` },
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.at.least(5); // seed has 5 orders
        });
      });
    });

    it('returns 403 when a customer tries to get all orders', () => {
      cy.request('POST', `${API}/auth/login`, {
        email: 'customer1@test.com',
        password: 'password123',
      }).then((loginRes) => {
        cy.request({
          method: 'GET',
          url: `${API}/orders`,
          headers: { Authorization: `Bearer ${loginRes.body.token}` },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(403);
        });
      });
    });
  });

  // ── Location Endpoint ──────────────────────────────────────────────────────
  describe('POST /api/location/update', () => {
    it('allows an agent to update their location', () => {
      cy.request('POST', `${API}/auth/login`, {
        email: 'agent1@test.com',
        password: 'password123',
      }).then((loginRes) => {
        cy.request({
          method: 'POST',
          url: `${API}/location/update`,
          headers: { Authorization: `Bearer ${loginRes.body.token}` },
          body: { lat: 19.076, lng: 72.8777 },
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.lat).to.eq(19.076);
          expect(res.body.lng).to.eq(72.8777);
          expect(res.body.isOnline).to.be.true;
        });
      });
    });

    it('returns 403 when a customer tries to update location', () => {
      cy.request('POST', `${API}/auth/login`, {
        email: 'customer1@test.com',
        password: 'password123',
      }).then((loginRes) => {
        cy.request({
          method: 'POST',
          url: `${API}/location/update`,
          headers: { Authorization: `Bearer ${loginRes.body.token}` },
          body: { lat: 19.076, lng: 72.8777 },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(403);
        });
      });
    });
  });
});
