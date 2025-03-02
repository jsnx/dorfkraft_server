const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Vehicle = require('../../src/models/vehicle.model');

const vehicleOne = {
  _id: new mongoose.Types.ObjectId(),
  registrationNumber: faker.string.alphanumeric(8).toUpperCase(),
  model: faker.vehicle.model(),
  capacity: {
    weight: faker.number.int({ min: 1000, max: 5000 }),
    volume: faker.number.float({ min: 10, max: 20, precision: 0.1 }),
  },
  status: 'AVAILABLE',
  currentLocation: {
    type: 'Point',
    coordinates: [13.405, 52.52],
  },
  maintenanceSchedule: {
    lastService: new Date('2024-01-01'),
    nextService: new Date('2024-04-01'),
    serviceIntervalKm: 20000,
  },
  isActive: true,
};

const vehicleTwo = {
  _id: new mongoose.Types.ObjectId(),
  registrationNumber: faker.string.alphanumeric(8).toUpperCase(),
  model: faker.vehicle.model(),
  capacity: {
    weight: faker.number.int({ min: 1000, max: 5000 }),
    volume: faker.number.float({ min: 10, max: 20, precision: 0.1 }),
  },
  status: 'AVAILABLE',
  currentLocation: {
    type: 'Point',
    coordinates: [13.404954, 52.520008],
  },
  maintenanceSchedule: {
    lastService: new Date('2024-01-01'),
    nextService: new Date('2024-04-01'),
    serviceIntervalKm: 20000,
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
