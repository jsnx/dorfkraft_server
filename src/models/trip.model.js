const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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
    destinations: [
      {
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
        actualArrival: Date,
        status: {
          type: String,
          enum: ['pending', 'arrived', 'completed'],
          default: 'pending',
        },
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed'],
      default: 'scheduled',
    },
    scheduledStart: {
      type: Date,
      required: true,
    },
    actualStart: Date,
    actualEnd: Date,
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add plugins
tripSchema.plugin(toJSON);
tripSchema.plugin(paginate);

// Create geospatial index for startLocation and destinations
tripSchema.index({ 'startLocation.coordinates': '2dsphere' });
tripSchema.index({ 'destinations.location.coordinates': '2dsphere' });

// Add this before creating the model
tripSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    ret.createdAt = ret.createdAt.toISOString();
    ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
