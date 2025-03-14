const mongoose = require('mongoose');
const { userOne } = require('./user.fixture');
const Driver = require('../../src/models/driver.model');

const uniqueSuffix = Date.now();
const driverOne = {
  _id: new mongoose.Types.ObjectId(),
  user: userOne._id,
  name: 'Test Driver 1',
  licenseNumber: `DL${uniqueSuffix}`,
  licenseExpiry: new Date('2024-12-31'),
  status: 'available',
  isActive: true,
  isDeleted: false,
  deletedAt: null,
};

const insertDriver = async (driver) => {
  return Driver.create(driver);
};

module.exports = {
  driverOne,
  insertDriver,
};
