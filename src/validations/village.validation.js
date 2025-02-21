const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createVillage = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    region: Joi.string().custom(objectId).required(),
    inhabitants: Joi.number().integer().min(0).required(),
    coordinates: Joi.object().keys({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }),
    isActive: Joi.boolean(),
  }),
};

const getVillages = {
  query: Joi.object().keys({
    name: Joi.string(),
    region: Joi.string().custom(objectId),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getVillage = {
  params: Joi.object().keys({
    villageId: Joi.string().custom(objectId),
  }),
};

const updateVillage = {
  params: Joi.object().keys({
    villageId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      region: Joi.string().custom(objectId),
      inhabitants: Joi.number().integer().min(0),
      coordinates: Joi.object().keys({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2),
      }),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deleteVillage = {
  params: Joi.object().keys({
    villageId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createVillage,
  getVillages,
  getVillage,
  updateVillage,
  deleteVillage,
};
