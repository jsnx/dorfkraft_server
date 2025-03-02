const httpStatus = require('http-status');
const { Driver } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a driver
 * @param {Object} driverBody
 * @returns {Promise<Driver>}
 */
const createDriver = async (driverBody) => {
  // Check if user exists and is already a driver
  const existingDriver = await Driver.findOne({ user: driverBody.user });
  if (existingDriver) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is already registered as a driver');
  }
  return Driver.create(driverBody);
};

/**
 * Query for drivers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryDrivers = async (filter, options) => {
  const drivers = await Driver.paginate(filter, options);
  return drivers;
};

/**
 * Get driver by id
 * @param {ObjectId} id
 * @returns {Promise<Driver>}
 */
const getDriverById = async (id) => {
  return Driver.findById(id);
};

/**
 * Update driver by id
 * @param {ObjectId} driverId
 * @param {Object} updateBody
 * @returns {Promise<Driver>}
 */
const updateDriverById = async (driverId, updateBody) => {
  const driver = await getDriverById(driverId);
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  Object.assign(driver, updateBody);
  await driver.save();
  return driver;
};

/**
 * Delete driver by id
 * @param {ObjectId} driverId
 * @returns {Promise<Driver>}
 */
const deleteDriver = async (driverId) => {
  const driver = await getDriverById(driverId);
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  await driver.softDelete();
  return driver;
};

/**
 * Restore soft-deleted driver
 * @param {ObjectId} driverId
 * @returns {Promise<Driver>}
 */
const restoreDriver = async (driverId) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  await driver.restore();
  return driver;
};

module.exports = {
  createDriver,
  queryDrivers,
  getDriverById,
  updateDriverById,
  deleteDriver,
  restoreDriver,
};
