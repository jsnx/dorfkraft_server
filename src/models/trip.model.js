const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const destinationSchema = mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: 'Germany',
      },
    },
  },
  village: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Village',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  estimatedArrival: {
    type: Date,
    required: true,
  },
  actualArrival: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['PENDING', 'ARRIVED', 'COMPLETED'],
    default: 'PENDING',
  },
});

const tripSchema = mongoose.Schema(
  {
    vehicle: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    driver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Driver',
      required: true,
    },
    status: {
      type: String,
      enum: ['PLANNED', 'LOADING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PLANNED',
    },
    scheduledStart: {
      type: Date,
      required: true,
    },
    actualStart: {
      type: Date,
    },
    actualEnd: {
      type: Date,
    },
    totalDistance: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          default: 'Germany',
        },
      },
    },
    destinations: [destinationSchema],
  },
  {
    timestamps: true,
  }
);

// Add indexes for common queries
tripSchema.index({ status: 1, scheduledStart: 1 });
tripSchema.index({ vehicle: 1, scheduledStart: 1 });
tripSchema.index({ driver: 1, scheduledStart: 1 });

// Add plugin that converts mongoose to json
tripSchema.plugin(toJSON);
tripSchema.plugin(paginate);

/**
 * Check if vehicle is available for this trip time
 * @param {ObjectId} vehicleId
 * @param {Date} start
 * @param {Date} end
 * @returns {Promise<boolean>}
 */
tripSchema.statics.isVehicleAvailable = async function (vehicleId, start, end) {
  const overlappingTrips = await this.countDocuments({
    vehicle: vehicleId,
    status: { $nin: ['COMPLETED', 'CANCELLED'] },
    scheduledStart: { $lt: end },
    $or: [{ actualEnd: { $gt: start } }, { actualEnd: null }],
  });
  return overlappingTrips === 0;
};

/**
 * Check if driver is available for this trip time
 * @param {ObjectId} driverId
 * @param {Date} start
 * @param {Date} end
 * @returns {Promise<boolean>}
 */
tripSchema.statics.isDriverAvailable = async function (driverId, start, end) {
  const overlappingTrips = await this.countDocuments({
    driver: driverId,
    status: { $nin: ['COMPLETED', 'CANCELLED'] },
    scheduledStart: { $lt: end },
    $or: [{ actualEnd: { $gt: start } }, { actualEnd: null }],
  });
  return overlappingTrips === 0;
};

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
