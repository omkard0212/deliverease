const User = require('../models/User');

// GET /api/users/agents  [admin only]
// Returns all users with role = "agent" for the assign-agent dropdown
const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('name email phone');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch agents', error: err.message });
  }
};

// GET /api/users/customers  [admin only]
// Returns all users with role = "customer" for the create-order dropdown
const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('name email phone');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers', error: err.message });
  }
};

module.exports = { getAgents, getCustomers };
