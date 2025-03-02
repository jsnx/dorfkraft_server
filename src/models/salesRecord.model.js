const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const salesRecordSchema = mongoose.Schema(
  {
    destination: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Destination',
      required: true,
    },
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantitySold: {
      type: Number,
      required: true,
      min: 0,
    },
    quantityReturned: {
      type: Number,
      default: 0,
      min: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    posTransactionId: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CARD', 'INVOICE'],
      required: true,
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

// Add compound index for efficient querying
salesRecordSchema.index({ destination: 1, product: 1, createdAt: 1 });

// Add plugin that converts mongoose to json
salesRecordSchema.plugin(toJSON);

const SalesRecord = mongoose.model('SalesRecord', salesRecordSchema);

module.exports = SalesRecord; 