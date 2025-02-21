const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { regionService } = require('../services');

const createRegion = catchAsync(async (req, res) => {
  const region = await regionService.createRegion(req.body);
  res.status(httpStatus.CREATED).send(region);
});

const getRegions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await regionService.queryRegions(filter, options);
  res.send(result);
});

const getRegion = catchAsync(async (req, res) => {
  const region = await regionService.getRegionById(req.params.regionId);
  if (!region) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Region not found');
  }
  res.send(region);
});

const updateRegion = catchAsync(async (req, res) => {
  const region = await regionService.updateRegionById(req.params.regionId, req.body);
  res.send(region);
});

const deleteRegion = catchAsync(async (req, res) => {
  await regionService.deleteRegion(req.params.regionId);
  res.status(httpStatus.NO_CONTENT).send();
});

const restoreRegion = catchAsync(async (req, res) => {
  const region = await regionService.restoreRegion(req.params.regionId);
  res.status(httpStatus.OK).send(region);
});

module.exports = {
  createRegion,
  getRegions,
  getRegion,
  updateRegion,
  deleteRegion,
  restoreRegion,
}; 