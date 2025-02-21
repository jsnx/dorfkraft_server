const httpStatus = require('http-status');
const { Vehicle, Driver } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a vehicle
 * @param {Object} vehicleBody
 * @returns {Promise<Vehicle>}
 */
const createVehicle = async (vehicleBody) => {
  return Vehicle.create(vehicleBody);
};

/**
 * Query for vehicles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryVehicles = async (filter, options) => {
  const vehicles = await Vehicle.paginate(filter, options);
  return vehicles;
};

/**
 * Get vehicle by id
 * @param {ObjectId} id
 * @returns {Promise<Vehicle>}
 */
const getVehicleById = async (id) => {
  return Vehicle.findById(id);
};

/**
 * Update vehicle by id
 * @param {ObjectId} vehicleId
 * @param {Object} updateBody
 * @returns {Promise<Vehicle>}
 */
const updateVehicleById = async (vehicleId, updateBody) => {
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  }
  Object.assign(vehicle, updateBody);
  await vehicle.save();
  return vehicle;
};

/**
 * Delete vehicle by id
 * @param {ObjectId} vehicleId
 * @returns {Promise<Vehicle>}
 */
const deleteVehicle = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  }

  const activeDriver = await Driver.findOne({
    vehicle: vehicleId,
    status: 'on-duty',
  });

  if (activeDriver) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete vehicle assigned to active driver');
  }

  await vehicle.softDelete();
  await Driver.updateMany({ vehicle: vehicleId }, { $unset: { vehicle: 1 } });

  return Vehicle.findOne({ _id: vehicleId, isDeleted: true });
};

/**
 * Restore soft-deleted vehicle
 * @param {ObjectId} vehicleId
 * @returns {Promise<Vehicle>}
 */
const restoreVehicle = async (vehicleId) => {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, isDeleted: true });
  if (!vehicle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  }
  await vehicle.restore();
  return Vehicle.findById(vehicleId);
};

module.exports = {
  createVehicle,
  queryVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicle,
  restoreVehicle,
};
