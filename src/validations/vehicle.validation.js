const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createVehicle = {
  body: Joi.object().keys({
    registrationNumber: Joi.string().required(),
    model: Joi.string().required(),
    capacity: Joi.object().keys({
      weight: Joi.number().min(0).required(),
      volume: Joi.number().min(0).required(),
    }).required(),
    status: Joi.string().valid('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE'),
    currentLocation: Joi.object().keys({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }),
    maintenanceSchedule: Joi.object().keys({
      lastService: Joi.date().required(),
      nextService: Joi.date().required(),
      serviceIntervalKm: Joi.number().min(0).required(),
    }),
    isActive: Joi.boolean(),
    notes: Joi.string(),
  }),
};

const getVehicles = {
  query: Joi.object().keys({
    registrationNumber: Joi.string(),
    model: Joi.string(),
    status: Joi.string().valid('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE'),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getVehicle = {
  params: Joi.object().keys({
    vehicleId: Joi.string().custom(objectId),
  }),
};

const updateVehicle = {
  params: Joi.object().keys({
    vehicleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      registrationNumber: Joi.string(),
      model: Joi.string(),
      capacity: Joi.object().keys({
        weight: Joi.number().min(0),
        volume: Joi.number().min(0),
      }),
      status: Joi.string().valid('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE'),
      currentLocation: Joi.object().keys({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2),
      }),
      maintenanceSchedule: Joi.object().keys({
        lastService: Joi.date(),
        nextService: Joi.date(),
        serviceIntervalKm: Joi.number().min(0),
      }),
      isActive: Joi.boolean(),
      notes: Joi.string(),
    })
    .min(1),
};

const deleteVehicle = {
  params: Joi.object().keys({
    vehicleId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    force: Joi.boolean().default(false),
  }),
};

const restoreVehicle = {
  params: Joi.object().keys({
    vehicleId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  restoreVehicle,
};
