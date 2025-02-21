const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const softDeletePlugin = require('../plugins/softDelete.plugin');

const driverSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    licenseExpiry: {
      type: Date,
      required: true,
    },
    vehicle: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Vehicle',
    },
    status: {
      type: String,
      enum: ['available', 'on-duty', 'off-duty'],
      default: 'available',
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
driverSchema.plugin(toJSON);
driverSchema.plugin(paginate);
driverSchema.plugin(softDeletePlugin);

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
