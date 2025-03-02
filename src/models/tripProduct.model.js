const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const tripProductSchema = mongoose.Schema(
  {
    trip: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Trip',
      required: true,
    },
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantityLoaded: {
      type: Number,
      required: true,
      min: 0,
    },
    quantityReturned: {
      type: Number,
      default: 0,
      min: 0,
    },
    // For tracking purposes
    loadedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index to ensure unique product per trip
tripProductSchema.index({ trip: 1, product: 1 }, { unique: true });

// Add plugin that converts mongoose to json
tripProductSchema.plugin(toJSON);

const TripProduct = mongoose.model('TripProduct', tripProductSchema);

module.exports = TripProduct; 