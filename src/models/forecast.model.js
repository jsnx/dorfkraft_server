const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const forecastSchema = mongoose.Schema(
  {
    village: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Village',
      required: true,
    },
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product',
      required: true,
    },
    forecastDate: {
      type: Date,
      required: true,
    },
    quantityForecasted: {
      type: Number,
      required: true,
      min: 0,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8,
    },
    // For tracking accuracy
    actualQuantitySold: {
      type: Number,
      min: 0,
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

// Add compound index for unique forecasts per village/product/date
forecastSchema.index({ village: 1, product: 1, forecastDate: 1 }, { unique: true });

// Add plugin that converts mongoose to json
forecastSchema.plugin(toJSON);

const Forecast = mongoose.model('Forecast', forecastSchema);

module.exports = Forecast; 