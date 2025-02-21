const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Vehicle = require('../../src/models/vehicle.model');

const vehicleOne = {
  _id: new mongoose.Types.ObjectId(),
  registrationNumber: faker.string.alphanumeric(8).toUpperCase(),
  model: faker.vehicle.model(),
  capacity: faker.number.int({ min: 1000, max: 10000 }),
  status: 'available',
  currentLocation: {
    type: 'Point',
    coordinates: [13.405, 52.52],
  },
  isActive: true,
};

const vehicleTwo = {
  _id: new mongoose.Types.ObjectId(),
  registrationNumber: faker.string.alphanumeric(8).toUpperCase(),
  model: faker.vehicle.model(),
  capacity: faker.number.int({ min: 1000, max: 10000 }),
  status: 'available',
  currentLocation: {
    type: 'Point',
    coordinates: [13.404954, 52.520008],
  },
  isActive: true,
};

const insertVehicles = async (vehicles) => {
  await Vehicle.insertMany(vehicles.map((vehicle) => ({ ...vehicle })));
};

const insertVehicle = async (vehicle) => {
  return Vehicle.create(vehicle);
};

module.exports = {
  vehicleOne,
  vehicleTwo,
  insertVehicles,
  insertVehicle,
};
