const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const productDeliverySchema = mongoose.Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  // For tracking actual delivery
  quantityDelivered: {
    type: Number,
    min: 0,
  },
  deliveryTime: {
    type: Date,
  },
  notes: {
    type: String,
    trim: true,
  },
});

const destinationSchema = mongoose.Schema(
  {
    trip: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Trip',
      required: true,
    },
    village: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Village',
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'],
      default: 'PENDING',
    },
    estimatedArrival: {
      type: Date,
      required: true,
    },
    actualArrival: {
      type: Date,
    },
    actualDeparture: {
      type: Date,
    },
    products: [productDeliverySchema],
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index for unique sequence per trip
destinationSchema.index({ trip: 1, sequence: 1 }, { unique: true });
destinationSchema.index({ trip: 1, village: 1 }, { unique: true });

// Add plugin that converts mongoose to json
destinationSchema.plugin(toJSON);

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination; 