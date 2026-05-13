const Order = require('../models/Order');
const User = require('../models/User');

// POST /api/orders  [admin only]
// Admin creates a new order and assigns it to a customer
const createOrder = async (req, res) => {
  try {
    const { customerId, pickupAddress, deliveryAddress, packageDescription } = req.body;

    if (!customerId || !pickupAddress || !deliveryAddress || !packageDescription) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const order = await Order.create({
      customerId,
      pickupAddress,
      deliveryAddress,
      packageDescription,
      statusHistory: [{ status: 'pending', note: 'Order created by admin' }],
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

// GET /api/orders  [admin only]
// Returns all orders with customer and agent details populated
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email phone')
      .populate('agentId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// GET /api/orders/my  [customer only]
// Returns only the orders belonging to the logged-in customer
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('agentId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your orders', error: err.message });
  }
};

// GET /api/orders/track/:trackingId  [public]
// Anyone with a tracking ID can look up the order status
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ trackingId: req.params.trackingId })
      .populate('customerId', 'name')
      .populate('agentId', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found — check your tracking ID' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to track order', error: err.message });
  }
};

// PUT /api/orders/:id/assign  [admin only]
// Admin assigns a delivery agent to an existing order
const assignAgent = async (req, res) => {
  try {
    const { agentId } = req.body;

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(400).json({ message: 'Invalid agent ID' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.agentId = agentId;
    order.status = 'assigned';
    order.statusHistory.push({ status: 'assigned', note: `Assigned to agent ${agent.name}` });
    await order.save();

    // Notify anyone tracking this order that the status changed
    const io = req.app.get('io');
    io.to(order.trackingId).emit('order_status_changed', {
      status: order.status,
      statusHistory: order.statusHistory,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign agent', error: err.message });
  }
};

// PUT /api/orders/:id/status  [agent only]
// Agent updates the status of one of their assigned orders
const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['picked_up', 'in_transit', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Agents can only update orders assigned to them
    if (order.agentId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || '' });
    await order.save();

    // Emit real-time status update to the customer's tracking room
    const io = req.app.get('io');
    io.to(order.trackingId).emit('order_status_changed', {
      status: order.status,
      statusHistory: order.statusHistory,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// GET /api/orders/agent  [agent only]
// Returns all orders assigned to the logged-in agent
const getAgentOrders = async (req, res) => {
  try {
    const orders = await Order.find({ agentId: req.user._id })
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch agent orders', error: err.message });
  }
};

module.exports = { createOrder, getAllOrders, getMyOrders, trackOrder, assignAgent, updateStatus, getAgentOrders };
