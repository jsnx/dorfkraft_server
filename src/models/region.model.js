const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const softDeletePlugin = require('../plugins/softDelete.plugin');

const regionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    baseAddress: {
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
    coordinates: {
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
    radius: {
      type: Number,
      required: true,
      min: 0,
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
regionSchema.plugin(toJSON);
regionSchema.plugin(paginate);
regionSchema.plugin(softDeletePlugin);

// Create geospatial index for coordinates
regionSchema.index({ coordinates: '2dsphere' });

// Pre-remove hook to handle cascading deletes
regionSchema.pre('remove', async function (next) {
  try {
    const Village = this.model('Village');
    const Driver = this.model('Driver');

    await Promise.all([
      Village.updateMany({ region: this._id }, { $unset: { region: 1 } }),
      Driver.updateMany({ region: this._id }, { $unset: { region: 1 } }),
    ]);

    next();
  } catch (error) {
    next(error);
  }
});

const Region = mongoose.model('Region', regionSchema);

module.exports = Region;
