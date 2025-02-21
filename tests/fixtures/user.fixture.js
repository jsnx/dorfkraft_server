const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { User } = require('../../src/models');

const password = 'password1';

const userOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  // Use User.create instead of insertMany to trigger the mongoose middleware
  await Promise.all(users.map((user) => User.create(user)));
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
