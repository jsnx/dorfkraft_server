const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTrip = {
  body: Joi.object().keys({
    vehicle: Joi.string().custom(objectId).required(),
    driver: Joi.string().custom(objectId).required(),
    startLocation: Joi.object().keys({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
      address: Joi.object().keys({
        street: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().default('Germany'),
      }),
    }),
    destinations: Joi.array()
      .items(
        Joi.object().keys({
          location: Joi.object().keys({
            type: Joi.string().valid('Point').default('Point'),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
            address: Joi.object().keys({
              street: Joi.string().required(),
              city: Joi.string().required(),
              postalCode: Joi.string().required(),
              country: Joi.string().default('Germany'),
            }),
          }),
          village: Joi.string().custom(objectId).required(),
          products: Joi.array()
            .items(
              Joi.object().keys({
                product: Joi.string().custom(objectId).required(),
                quantity: Joi.number().integer().min(1).required(),
              })
            )
            .min(1)
            .required(),
          estimatedArrival: Joi.date().required(),
        })
      )
      .min(1)
      .required(),
    scheduledStart: Joi.date().required(),
    notes: Joi.string(),
  }),
};

const getTrips = {
  query: Joi.object().keys({
    vehicle: Joi.string().custom(objectId),
    driver: Joi.string().custom(objectId),
    status: Joi.string().valid('PLANNED', 'LOADING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTrip = {
  params: Joi.object().keys({
    tripId: Joi.string().custom(objectId),
  }),
};

const updateTrip = {
  params: Joi.object().keys({
    tripId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('PLANNED', 'LOADING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      notes: Joi.string().allow(''),
      actualStart: Joi.date().optional(),
      actualEnd: Joi.date().optional(),
    })
    .min(1),
};

const updateDestination = {
  params: Joi.object().keys({
    tripId: Joi.required().custom(objectId),
    destinationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('PENDING', 'ARRIVED', 'COMPLETED'),
      // ... other validation rules
    })
    .min(1),
};

const deleteTrip = {
  params: Joi.object().keys({
    tripId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  updateDestination,
  deleteTrip,
};
