const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Trip } = require('../models');
const catchAsync = require('../utils/catchAsync');

const validateStatusTransition = catchAsync(async (req, res, next) => {
  if (req.body.status) {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
    }

    const validTransitions = {
      PLANNED: ['IN_PROGRESS'],
      IN_PROGRESS: ['COMPLETED'],
      COMPLETED: [],
    };

    if (!validTransitions[trip.status] || !validTransitions[trip.status].includes(req.body.status)) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Invalid status transition from ${trip.status} to ${req.body.status}`);
    }

    if (req.body.status === 'IN_PROGRESS') {
      req.body.actualStart = new Date().toISOString();
    }
  }
  next();
});

module.exports = {
  validateStatusTransition,
};
