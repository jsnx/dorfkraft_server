const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Product = require('../../src/models/product.model');

const productOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.commerce.productName(),
  category: 'BREAD',
  description: faker.commerce.productDescription(),
  unit: 'PIECE',
  weight: 0.75,
  volume: 0.003,
  unitPrice: parseFloat(faker.commerce.price()),
  currentStock: faker.number.int({ min: 10, max: 1000 }),
  shelfLife: 5,
  productionCost: 1.2,
  isSeasonalOnly: false,
  isActive: true,
};

const productTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'Test Product 2',
  category: 'PASTRY',
  description: 'Test Description 2',
  unit: 'PIECE',
  weight: 0.25,
  volume: 0.0006,
  unitPrice: 15.99,
  currentStock: 200,
  shelfLife: 3,
  productionCost: 0.9,
  isSeasonalOnly: false,
  isActive: true,
};

const insertProduct = async (product) => {
  return Product.create(product);
};

module.exports = {
  productOne,
  productTwo,
  insertProduct,
};
