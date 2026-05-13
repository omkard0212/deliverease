const AgentLocation = require('../models/AgentLocation');

// POST /api/location/update  [agent only]
// Agent sends their current GPS coordinates — we upsert into AgentLocation
const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'lat and lng are required' });
    }

    const location = await AgentLocation.findOneAndUpdate(
      { agentId: req.user._id },
      { lat, lng, isOnline: true, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.json(location);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update location', error: err.message });
  }
};

// GET /api/location/:agentId  [protected]
// Returns the most recent known location of a specific agent
const getAgentLocation = async (req, res) => {
  try {
    const location = await AgentLocation.findOne({ agentId: req.params.agentId });

    if (!location) {
      return res.status(404).json({ message: 'Location not found for this agent' });
    }

    res.json(location);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch location', error: err.message });
  }
};

module.exports = { updateLocation, getAgentLocation };
