const express = require('express');
const router = express.Router();
const { updateLocation, getAgentLocation } = require('../controllers/locationController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

// Agent pushes their current GPS position
router.post('/update', protect, checkRole(['agent']), updateLocation);

// Anyone authenticated can fetch an agent's last known location
router.get('/:agentId', protect, getAgentLocation);

module.exports = router;
