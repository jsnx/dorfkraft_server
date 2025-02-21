const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { driverService } = require('../services');

const createDriver = catchAsync(async (req, res) => {
  const driver = await driverService.createDriver(req.body);
  res.status(httpStatus.CREATED).send(driver);
});

const getDrivers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'licenseNumber', 'status', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await driverService.queryDrivers(filter, options);
  res.send(result);
});

const getDriver = catchAsync(async (req, res) => {
  const driver = await driverService.getDriverById(req.params.driverId);
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  res.send(driver);
});

const updateDriver = catchAsync(async (req, res) => {
  const driver = await driverService.updateDriverById(req.params.driverId, req.body);
  res.send(driver);
});

const deleteDriver = catchAsync(async (req, res) => {
  const driver = await driverService.getDriverById(req.params.driverId);
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  await driver.softDelete();
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDriver,
  getDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
};
