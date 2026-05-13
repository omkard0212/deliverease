# 📦 DeliverEase — Real-Time Package Delivery Tracker

A full-stack MERN web application that lets customers track their packages live on a map, delivery agents update status and share GPS location from their phone, and admins manage orders end-to-end.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18 (Vite), Tailwind CSS, React Router v6  |
| Maps       | Leaflet.js + react-leaflet (OpenStreetMap tiles) |
| Real-time  | Socket.IO (client + server)                     |
| Backend    | Node.js, Express                                |
| Database   | MongoDB, Mongoose                               |
| Auth       | JWT (jsonwebtoken), bcryptjs                    |

---

## Features

- [x] Customer registration and login
- [x] Role-based access (customer / agent / admin)
- [x] Admin can create orders and assign delivery agents
- [x] Customer dashboard with all their orders
- [x] Live tracking page with Leaflet.js map
- [x] Animated agent location marker that updates in real time
- [x] Straight-line ETA calculation (Haversine formula)
- [x] Order status timeline (Placed → Picked Up → In Transit → Delivered)
- [x] Agent dashboard with location sharing toggle (broadcasts every 5 s)
- [x] Agent can update order status (Picked Up / In Transit / Delivered)
- [x] Socket.IO rooms — each order has its own room, no cross-order leakage
- [x] Status history audit trail on every order
- [x] Mobile-friendly UI (agents use phones)
- [x] JWT persisted in localStorage, restored on page refresh

---

## Screenshots

> _Add screenshots here after running the app_

| Login | Customer Tracking | Admin Dashboard |
|-------|-------------------|-----------------|
| ![login](docs/login.png) | ![track](docs/track.png) | ![admin](docs/admin.png) |

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on port 27017 (or update `MONGO_URI` in `server/.env`)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/deliverease.git
cd deliverease
```

### 2. Install dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Configure environment variables

`server/.env` (already created):
```
MONGO_URI=mongodb://localhost:27017/deliverease
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

`client/.env` (already created):
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Seed the database
```bash
cd server
node seed.js
```

This creates:
- 1 admin · 3 agents · 3 customers
- 5 sample orders in various statuses with Indian city coordinates

### 5. Run the app

Open **two terminals**:

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

Visit **http://localhost:5173**

### Demo credentials
| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@test.com         | password123 |
| Agent    | agent1@test.com        | password123 |
| Customer | customer1@test.com     | password123 |

---

## API Endpoints

### Auth
| Method | Endpoint            | Access    | Description                  |
|--------|---------------------|-----------|------------------------------|
| POST   | /api/auth/register  | Public    | Register new customer        |
| POST   | /api/auth/login     | Public    | Login, returns JWT           |
| GET    | /api/auth/me        | Protected | Get current user profile     |

### Orders
| Method | Endpoint                        | Access   | Description                        |
|--------|---------------------------------|----------|------------------------------------|
| POST   | /api/orders                     | Admin    | Create a new order                 |
| GET    | /api/orders                     | Admin    | Get all orders                     |
| GET    | /api/orders/my                  | Customer | Get logged-in customer's orders    |
| GET    | /api/orders/agent               | Agent    | Get agent's assigned orders        |
| GET    | /api/orders/track/:trackingId   | Public   | Track order by tracking ID         |
| PUT    | /api/orders/:id/assign          | Admin    | Assign an agent to an order        |
| PUT    | /api/orders/:id/status          | Agent    | Update order status                |

### Location
| Method | Endpoint                  | Access    | Description                        |
|--------|---------------------------|-----------|------------------------------------|
| POST   | /api/location/update      | Agent     | Save agent's current GPS position  |
| GET    | /api/location/:agentId    | Protected | Get agent's last known location    |

---

## How Real-Time Works

```
Agent Phone                    Server (Socket.IO)              Customer Browser
    |                                  |                               |
    |-- emit("agent_location_update") -->|                              |
    |   { agentId, lat, lng,           |                              |
    |     trackingId }                 |-- saves to AgentLocation DB  |
    |                                  |                              |
    |                                  |-- io.to(trackingId).emit() -->|
    |                                  |   "agent_location_update"    |
    |                                  |   { lat, lng }               |
    |                                  |                              |
    |                                  |                   Map marker moves ✓
    |                                  |
    |  (Agent updates status via REST) |
    |-- PUT /api/orders/:id/status --->|
    |                                  |-- io.to(trackingId).emit() -->|
    |                                  |   "order_status_changed"     |
    |                                  |   { status, statusHistory }  |
    |                                  |                              |
    |                                  |                   Timeline updates ✓
```

Each order has its own Socket.IO room named after its `trackingId`. Customers join the room on the tracking page; agents emit to it. This ensures updates are scoped to the correct order.
