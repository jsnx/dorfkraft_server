const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const softDeletePlugin = require('../plugins/softDelete.plugin');

const villageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Region',
      required: true,
    },
    inhabitants: {
      type: Number,
      required: true,
      min: 0,
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
villageSchema.plugin(toJSON);
villageSchema.plugin(paginate);
villageSchema.plugin(softDeletePlugin);

// Create geospatial index for coordinates
villageSchema.index({ coordinates: '2dsphere' });

// Pre-remove hook to handle cascading deletes
villageSchema.pre('remove', async function (next) {
  try {
    const Driver = this.model('Driver');
    await Driver.updateMany({ village: this._id }, { $unset: { village: 1 } });
    next();
  } catch (error) {
    next(error);
  }
});

const Village = mongoose.model('Village', villageSchema);

module.exports = Village;
