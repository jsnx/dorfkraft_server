const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDriver = {
  body: Joi.object().keys({
    user: Joi.string().custom(objectId).required(),
    name: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    licenseExpiry: Joi.date().required(),
    status: Joi.string().valid('available', 'on-duty', 'off-duty'),
    isActive: Joi.boolean(),
  }),
};

const getDrivers = {
  query: Joi.object().keys({
    licenseNumber: Joi.string(),
    status: Joi.string().valid('available', 'on-duty', 'off-duty'),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDriver = {
  params: Joi.object().keys({
    driverId: Joi.string().custom(objectId),
  }),
};

const updateDriver = {
  params: Joi.object().keys({
    driverId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      licenseNumber: Joi.string(),
      licenseExpiry: Joi.date(),
      status: Joi.string().valid('available', 'on-duty', 'off-duty'),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deleteDriver = {
  params: Joi.object().keys({
    driverId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDriver,
  getDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
};
