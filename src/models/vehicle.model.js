const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const softDeletePlugin = require('../plugins/softDelete.plugin');

const vehicleSchema = mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'in-use', 'maintenance'],
      default: 'available',
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins
vehicleSchema.plugin(toJSON);
vehicleSchema.plugin(paginate);
vehicleSchema.plugin(softDeletePlugin);

// Create geospatial index for currentLocation
vehicleSchema.index({ currentLocation: '2dsphere' });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
