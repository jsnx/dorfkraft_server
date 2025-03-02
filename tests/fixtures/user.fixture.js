const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../../src/models/user.model');

const password = 'password1';

// Generate a unique timestamp suffix for emails to avoid conflicts
const uniqueSuffix = Date.now();

const admin = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  email: `admin-${uniqueSuffix}@example.com`,
  password,
  role: 'admin',
  isEmailVerified: true,
};

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  email: `user1-${uniqueSuffix}@example.com`,
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  email: `user2-${uniqueSuffix}@example.com`,
  password,
  role: 'user',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  // Clear existing users first
  await User.deleteMany({});
  // Use create() for each user to ensure the pre-save hook is triggered
  await Promise.all(users.map((user) => User.create(user)));
};

module.exports = {
  admin,
  userOne,
  userTwo,
  insertUsers,
};
