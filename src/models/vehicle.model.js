const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const softDelete = require('../plugins/softDelete.plugin');

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
      weight: {
        type: Number,
        required: true,
        min: 0,
      },
      volume: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE'],
      default: 'AVAILABLE',
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
    maintenanceSchedule: {
      lastService: {
        type: Date,
        required: true,
      },
      nextService: {
        type: Date,
        required: true,
      },
      serviceIntervalKm: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Add plugins
vehicleSchema.plugin(toJSON);
vehicleSchema.plugin(paginate);
vehicleSchema.plugin(softDelete);

// Add indexes
vehicleSchema.index({ registrationNumber: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ 'currentLocation.coordinates': '2dsphere' });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
