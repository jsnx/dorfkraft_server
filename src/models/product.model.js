const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['BREAD', 'ROLLS', 'PRETZEL', 'PASTRY', 'CAKE', 'SEASONAL'],
      required: true,
      default: 'BREAD',
    },
    description: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      enum: ['PIECE', 'KG', 'DOZEN'],
      default: 'PIECE',
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      default: 0.5,
    },
    volume: {
      type: Number,
      required: true,
      min: 0,
      default: 0.001,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    shelfLife: {
      type: Number,
      required: true,
      min: 1,
      default: 3,
    },
    productionCost: {
      type: Number,
      required: true,
      min: 0,
      default: 1.0,
    },
    isSeasonalOnly: {
      type: Boolean,
      default: false,
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

// Add a pre-save hook to set default values for required fields if they're not provided
productSchema.pre('save', function (next) {
  // This ensures the model validation passes even if the API validation doesn't include these fields
  if (!this.category) this.category = 'BREAD';
  if (!this.weight) this.weight = 0.5;
  if (!this.volume) this.volume = 0.001;
  if (!this.shelfLife) this.shelfLife = 3;
  if (!this.productionCost) this.productionCost = 1.0;
  next();
});

// Add indexes
productSchema.index({ name: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ isSeasonalOnly: 1 });

// Add plugin that converts mongoose to json
productSchema.plugin(toJSON);

/**
 * Check if enough stock is available
 * @param {number} quantity - Quantity needed
 * @returns {Promise<boolean>}
 */
productSchema.methods.hasEnoughStock = async function (quantity) {
  return this.currentStock >= quantity;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
