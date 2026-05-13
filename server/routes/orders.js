const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  trackOrder,
  assignAgent,
  updateStatus,
  getAgentOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

// Public — anyone with a tracking ID can check status
router.get('/track/:trackingId', trackOrder);

// Customer routes
router.get('/my', protect, checkRole(['customer']), getMyOrders);

// Agent routes
router.get('/agent', protect, checkRole(['agent']), getAgentOrders);
router.put('/:id/status', protect, checkRole(['agent']), updateStatus);

// Admin routes
router.post('/', protect, checkRole(['admin']), createOrder);
router.get('/', protect, checkRole(['admin']), getAllOrders);
router.put('/:id/assign', protect, checkRole(['admin']), assignAgent);

module.exports = router;
