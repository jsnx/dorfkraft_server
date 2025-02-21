const httpStatus = require('http-status');
const { Region, Village, Driver } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a region
 * @param {Object} regionBody
 * @returns {Promise<Region>}
 */
const createRegion = async (regionBody) => {
  return Region.create(regionBody);
};

/**
 * Query for regions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<Region[]>}
 */
const queryRegions = async (filter, options) => {
  const regions = await Region.paginate(filter, options);
  return regions;
};

/**
 * Get region by id
 * @param {ObjectId} id
 * @returns {Promise<Region>}
 */
const getRegionById = async (id) => {
  return Region.findById(id);
};

/**
 * Update region by id
 * @param {ObjectId} regionId
 * @param {Object} updateBody
 * @returns {Promise<Region>}
 */
const updateRegionById = async (regionId, updateBody) => {
  const region = await getRegionById(regionId);
  if (!region) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Region not found');
  }
  Object.assign(region, updateBody);
  await region.save();
  return region;
};

/**
 * Delete region by id
 * @param {ObjectId} regionId
 * @returns {Promise<Region>}
 */
const deleteRegion = async (regionId) => {
  const region = await Region.findById(regionId);
  if (!region) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Region not found');
  }

  await region.softDelete();

  // Update related entities
  await Promise.all([
    Village.updateMany({ region: regionId }, { $unset: { region: 1 } }),
    Driver.updateMany({ region: regionId }, { $unset: { region: 1 } }),
  ]);

  return Region.findById(regionId); // Return fresh copy with updated fields
};

/**
 * Restore soft-deleted region
 * @param {ObjectId} regionId
 * @returns {Promise<Region>}
 */
const restoreRegion = async (regionId) => {
  const region = await Region.findOne({ 
    _id: regionId, 
    isDeleted: true 
  });
  
  if (!region) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Region not found');
  }

  await region.restore();
  return Region.findById(regionId); // Return fresh copy with updated fields
};

module.exports = {
  createRegion,
  queryRegions,
  getRegionById,
  updateRegionById,
  deleteRegion,
  restoreRegion,
};
