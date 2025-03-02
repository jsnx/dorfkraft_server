const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Trip = require('../../src/models/trip.model');
const { vehicleOne } = require('./vehicle.fixture');
const { driverOne } = require('./driver.fixture');
const { villageOne } = require('./village.fixture');
const { productOne } = require('./product.fixture');

const tripOne = {
  _id: mongoose.Types.ObjectId(),
  vehicle: vehicleOne._id,
  driver: driverOne._id,
  status: 'PLANNED',
  startLocation: {
    type: 'Point',
    coordinates: [13.405, 52.52],
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      country: 'Germany',
    },
  },
  destinations: [
    {
      _id: mongoose.Types.ObjectId(),
      location: {
        type: 'Point',
        coordinates: [13.505, 52.62],
        address: {
          street: faker.location.street(),
          city: faker.location.city(),
          postalCode: faker.location.zipCode(),
          country: 'Germany',
        },
      },
      village: villageOne._id,
      products: [
        {
          product: productOne._id,
          quantity: faker.number.int({ min: 1, max: 100 }),
        },
      ],
      estimatedArrival: faker.date.future(),
      status: 'PENDING',
    },
  ],
  scheduledStart: faker.date.future(),
};

const tripTwo = {
  _id: new mongoose.Types.ObjectId(),
  vehicle: vehicleOne._id,
  driver: driverOne._id,
  startLocation: {
    type: 'Point',
    coordinates: [13.406, 52.53],
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      country: 'Germany',
    },
  },
  destinations: [
    {
      _id: new mongoose.Types.ObjectId(),
      location: {
        type: 'Point',
        coordinates: [13.506, 52.63],
        address: {
          street: faker.location.street(),
          city: faker.location.city(),
          postalCode: faker.location.zipCode(),
          country: 'Germany',
        },
      },
      village: villageOne._id,
      products: [
        {
          product: productOne._id,
          quantity: faker.number.int({ min: 1, max: 100 }),
        },
      ],
      estimatedArrival: faker.date.future(),
      status: 'PENDING',
    },
  ],
  status: 'IN_PROGRESS',
  scheduledStart: faker.date.future(),
  actualStart: faker.date.recent(),
};

const insertTrips = async (trips) => {
  await Trip.insertMany(trips.map((trip) => ({ ...trip })));
};

const insertTrip = async (trip) => {
  await Trip.create(trip);
};

module.exports = {
  tripOne,
  tripTwo,
  insertTrips,
  insertTrip,
};
