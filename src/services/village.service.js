const httpStatus = require('http-status');
const { Village, Driver } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a village
 * @param {Object} villageBody
 * @returns {Promise<Village>}
 */
const createVillage = async (villageBody) => {
  return Village.create(villageBody);
};

/**
 * Query for villages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryVillages = async (filter, options) => {
  const villages = await Village.paginate(filter, options);
  return villages;
};

/**
 * Get village by id
 * @param {ObjectId} id
 * @returns {Promise<Village>}
 */
const getVillageById = async (id) => {
  return Village.findById(id);
};

/**
 * Update village by id
 * @param {ObjectId} villageId
 * @param {Object} updateBody
 * @returns {Promise<Village>}
 */
const updateVillageById = async (villageId, updateBody) => {
  const village = await getVillageById(villageId);
  if (!village) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Village not found');
  }
  Object.assign(village, updateBody);
  await village.save();
  return village;
};

/**
 * Delete village by id
 * @param {ObjectId} villageId
 * @returns {Promise<Village>}
 */
const deleteVillage = async (villageId) => {
  const village = await Village.findById(villageId);
  if (!village) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Village not found');
  }

  await village.softDelete();
  await Driver.updateMany({ village: villageId }, { $unset: { village: 1 } });
  return Village.findOne({ _id: villageId, isDeleted: true });
};

/**
 * Restore soft-deleted village
 * @param {ObjectId} villageId
 * @returns {Promise<Village>}
 */
const restoreVillage = async (villageId) => {
  const village = await Village.findOne({ _id: villageId, isDeleted: true });
  if (!village) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Village not found');
  }
  await village.restore();
  return Village.findById(villageId);
};

module.exports = {
  createVillage,
  queryVillages,
  getVillageById,
  updateVillageById,
  deleteVillage,
  restoreVillage,
};
