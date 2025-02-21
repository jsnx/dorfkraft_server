const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Product = require('../../src/models/product.model');

const productOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  unit: 'kg',
  unitPrice: parseFloat(faker.commerce.price()),
  currentStock: faker.number.int({ min: 10, max: 1000 }),
  isActive: true,
};

const productTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'Test Product 2',
  description: 'Test Description 2',
  unit: 'kg',
  unitPrice: 15.99,
  currentStock: 200,
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
