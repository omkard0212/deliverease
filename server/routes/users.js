const express = require('express');
const router = express.Router();
const { getAgents, getCustomers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

router.get('/agents',    protect, checkRole(['admin']), getAgents);
router.get('/customers', protect, checkRole(['admin']), getCustomers);

module.exports = router;
