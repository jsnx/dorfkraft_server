const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { villageService } = require('../services');

const createVillage = catchAsync(async (req, res) => {
  const village = await villageService.createVillage(req.body);
  res.status(httpStatus.CREATED).send(village);
});

const getVillages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'region', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await villageService.queryVillages(filter, options);
  res.send(result);
});

const getVillage = catchAsync(async (req, res) => {
  const village = await villageService.getVillageById(req.params.villageId);
  if (!village) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Village not found');
  }
  res.send(village);
});

const updateVillage = catchAsync(async (req, res) => {
  const village = await villageService.updateVillageById(req.params.villageId, req.body);
  res.send(village);
});

const deleteVillage = catchAsync(async (req, res) => {
  await villageService.deleteVillage(req.params.villageId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createVillage,
  getVillages,
  getVillage,
  updateVillage,
  deleteVillage,
};
