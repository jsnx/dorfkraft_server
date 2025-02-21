const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRegion = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    baseAddress: Joi.object().keys({
      street: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().default('Germany'),
    }),
    coordinates: Joi.object().keys({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }),
    radius: Joi.number().min(0).required(),
    isActive: Joi.boolean(),
  }),
};

const getRegions = {
  query: Joi.object().keys({
    name: Joi.string(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRegion = {
  params: Joi.object().keys({
    regionId: Joi.string().custom(objectId),
  }),
};

const updateRegion = {
  params: Joi.object().keys({
    regionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      baseAddress: Joi.object().keys({
        street: Joi.string(),
        city: Joi.string(),
        postalCode: Joi.string(),
        country: Joi.string(),
      }),
      coordinates: Joi.object().keys({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2),
      }),
      radius: Joi.number().min(0),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deleteRegion = {
  params: Joi.object().keys({
    regionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRegion,
  getRegions,
  getRegion,
  updateRegion,
  deleteRegion,
}; 