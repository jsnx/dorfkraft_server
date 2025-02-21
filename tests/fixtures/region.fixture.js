const mongoose = require('mongoose');
const Region = require('../../src/models/region.model');

const regionOne = {
  _id: mongoose.Types.ObjectId(),
  name: 'Test Region 1',
  baseAddress: {
    street: 'Test Street 1',
    city: 'Test City',
    postalCode: '12345',
    country: 'Germany',
  },
  coordinates: {
    type: 'Point',
    coordinates: [13.404954, 52.520008],
  },
  radius: 10,
  isActive: true,
};

const regionTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'Test Region 2',
  baseAddress: {
    street: 'Test Street 2',
    city: 'Test City 2',
    postalCode: '67890',
    country: 'Germany',
  },
  coordinates: {
    type: 'Point',
    coordinates: [13.405, 52.52],
  },
  radius: 20,
  isActive: true,
};

const insertRegion = async (region) => {
  return Region.create({ ...region });
};

module.exports = {
  regionOne,
  regionTwo,
  insertRegion,
};
