const mongoose = require('mongoose');
const { regionOne } = require('./region.fixture');
const Village = require('../../src/models/village.model');

const villageOne = {
  _id: mongoose.Types.ObjectId(),
  name: 'Test Village 1',
  region: regionOne._id,
  inhabitants: 1000,
  coordinates: {
    type: 'Point',
    coordinates: [13.404954, 52.520008],
  },
  isActive: true,
};

const villageTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'Test Village 2',
  region: regionOne._id,
  inhabitants: 2000,
  coordinates: {
    type: 'Point',
    coordinates: [13.505, 52.52],
  },
  isActive: true,
};

const insertVillages = async (villages) => {
  await Village.insertMany(villages.map((village) => ({ ...village })));
};

const insertVillage = async (village) => {
  return Village.create(village);
};

module.exports = {
  villageOne,
  villageTwo,
  insertVillages,
  insertVillage,
};
