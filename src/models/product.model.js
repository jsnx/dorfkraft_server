const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
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
    },
    vehicle: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Vehicle',
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
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

// Override toJSON options
productSchema.set('toJSON', {
  transform: (doc, ret) => {
    const transformed = {
      id: ret._id.toString(),
      name: ret.name,
      description: ret.description,
      unit: ret.unit,
      unitPrice: ret.unitPrice,
      currentStock: ret.currentStock,
      isActive: ret.isActive,
    };
    if (ret.vehicle) {
      transformed.vehicle = ret.vehicle;
    }
    return transformed;
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
