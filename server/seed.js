/**
 * Seed script — populates the database with sample users and orders.
 * Run with: node server/seed.js  (from project root)
 *           or: npm run seed     (from server/ directory)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const AgentLocation = require('./models/AgentLocation');

// Real Indian city coordinates for realistic demo data
const CITIES = {
  mumbai:    { label: 'Mumbai, Maharashtra',   lat: 19.076,  lng: 72.8777 },
  delhi:     { label: 'New Delhi, Delhi',       lat: 28.6139, lng: 77.209  },
  bangalore: { label: 'Bengaluru, Karnataka',   lat: 12.9716, lng: 77.5946 },
  pune:      { label: 'Pune, Maharashtra',      lat: 18.5204, lng: 73.8567 },
  hyderabad: { label: 'Hyderabad, Telangana',   lat: 17.385,  lng: 78.4867 },
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data so the script is idempotent
  await User.deleteMany({});
  await Order.deleteMany({});
  await AgentLocation.deleteMany({});
  console.log('Cleared existing data');

  // ── Users ──────────────────────────────────────────────────────────────────
  // Use .save() so the bcrypt pre-save hook fires and hashes passwords
  const [admin, agent1, agent2, agent3, cust1, cust2, cust3] = await Promise.all([
    new User({ name: 'Admin User',    email: 'admin@test.com',     password: 'password123', role: 'admin',    phone: '9000000000' }).save(),
    new User({ name: 'Ravi Kumar',    email: 'agent1@test.com',    password: 'password123', role: 'agent',    phone: '9111111111' }).save(),
    new User({ name: 'Priya Sharma',  email: 'agent2@test.com',    password: 'password123', role: 'agent',    phone: '9222222222' }).save(),
    new User({ name: 'Arjun Singh',   email: 'agent3@test.com',    password: 'password123', role: 'agent',    phone: '9333333333' }).save(),
    new User({ name: 'Ananya Patel',  email: 'customer1@test.com', password: 'password123', role: 'customer', phone: '9444444444' }).save(),
    new User({ name: 'Vikram Nair',   email: 'customer2@test.com', password: 'password123', role: 'customer', phone: '9555555555' }).save(),
    new User({ name: 'Sneha Reddy',   email: 'customer3@test.com', password: 'password123', role: 'customer', phone: '9666666666' }).save(),
  ]);
  console.log('Users created');

  // ── Agent Locations ────────────────────────────────────────────────────────
  await AgentLocation.insertMany([
    { agentId: agent1._id, lat: 19.082,  lng: 72.881,  isOnline: true,  lastUpdated: new Date() },
    { agentId: agent2._id, lat: 28.618,  lng: 77.212,  isOnline: true,  lastUpdated: new Date() },
    { agentId: agent3._id, lat: 12.975,  lng: 77.597,  isOnline: false, lastUpdated: new Date() },
  ]);
  console.log('Agent locations created');

  // ── Orders ─────────────────────────────────────────────────────────────────
  // Use .save() instead of insertMany so the pre-save hook fires and
  // generates a unique trackingId for each order.
  const orderDefs = [
    {
      customerId: cust1._id,
      agentId: agent1._id,
      status: 'in_transit',
      pickupAddress: CITIES.mumbai,
      deliveryAddress: CITIES.pune,
      packageDescription: 'Electronics — Laptop',
      statusHistory: [
        { status: 'pending',    note: 'Order placed' },
        { status: 'assigned',   note: 'Assigned to Ravi Kumar' },
        { status: 'picked_up',  note: 'Package collected from sender' },
        { status: 'in_transit', note: 'Out for delivery' },
      ],
    },
    {
      customerId: cust2._id,
      agentId: agent2._id,
      status: 'delivered',
      pickupAddress: CITIES.delhi,
      deliveryAddress: CITIES.hyderabad,
      packageDescription: 'Clothing — 2 boxes',
      statusHistory: [
        { status: 'pending',    note: 'Order placed' },
        { status: 'assigned',   note: 'Assigned to Priya Sharma' },
        { status: 'picked_up',  note: 'Package collected' },
        { status: 'in_transit', note: 'In transit' },
        { status: 'delivered',  note: 'Delivered successfully' },
      ],
    },
    {
      customerId: cust3._id,
      agentId: null,
      status: 'pending',
      pickupAddress: CITIES.bangalore,
      deliveryAddress: CITIES.mumbai,
      packageDescription: 'Books — 5kg',
      statusHistory: [{ status: 'pending', note: 'Order placed, awaiting agent assignment' }],
    },
    {
      customerId: cust1._id,
      agentId: agent3._id,
      status: 'assigned',
      pickupAddress: CITIES.pune,
      deliveryAddress: CITIES.delhi,
      packageDescription: 'Medical supplies',
      statusHistory: [
        { status: 'pending',  note: 'Order placed' },
        { status: 'assigned', note: 'Assigned to Arjun Singh' },
      ],
    },
    {
      customerId: cust2._id,
      agentId: agent1._id,
      status: 'picked_up',
      pickupAddress: CITIES.hyderabad,
      deliveryAddress: CITIES.bangalore,
      packageDescription: 'Fragile — Glassware',
      statusHistory: [
        { status: 'pending',   note: 'Order placed' },
        { status: 'assigned',  note: 'Assigned to Ravi Kumar' },
        { status: 'picked_up', note: 'Package collected from sender' },
      ],
    },
  ];

  for (const def of orderDefs) {
    await new Order(def).save();
  }
  console.log('Orders created');

  console.log('\n✅ Seed complete! Login credentials:');
  console.log('  Admin:     admin@test.com     / password123');
  console.log('  Agents:    agent1@test.com    / password123  (and agent2, agent3)');
  console.log('  Customers: customer1@test.com / password123  (and customer2, customer3)');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
