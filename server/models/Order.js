const mongoose = require('mongoose');

// Sub-schema for address fields (used for both pickup and delivery)
const addressSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

// Each entry in statusHistory records when and why a status changed
const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    note: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Auto-generated unique tracking ID in the format DE-XXXXXX
    trackingId: {
      type: String,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Agent is optional at creation — assigned later by admin
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered'],
      default: 'pending',
    },
    pickupAddress: { type: addressSchema, required: true },
    deliveryAddress: { type: addressSchema, required: true },
    packageDescription: {
      type: String,
      required: [true, 'Package description is required'],
    },
    // Full audit trail of every status change
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

// Generate a random tracking ID before the document is first saved
orderSchema.pre('save', function (next) {
  if (!this.trackingId) {
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.trackingId = `DE-${suffix}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
