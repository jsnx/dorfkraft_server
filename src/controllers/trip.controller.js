const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tripService } = require('../services');
const Trip = require('../models/trip.model');

const createTrip = catchAsync(async (req, res) => {
  const trip = await tripService.createTrip(req.body);
  res.status(httpStatus.CREATED).send(trip);
});

const getTrips = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await tripService.queryTrips(filter, options);
  res.send(result);
});

const getTrip = catchAsync(async (req, res) => {
  const trip = await tripService.getTripById(req.params.tripId);
  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }
  res.send(trip);
});

const updateTrip = catchAsync(async (req, res) => {
  const trip = await tripService.updateTripById(req.params.tripId, req.body);
  res.send(trip);
});

const updateTripDestination = catchAsync(async (req, res) => {
  const trip = await tripService.updateTripDestinationStatus(req.params.tripId, req.params.destinationId, req.body);
  res.send(trip);
});

const updateDestination = catchAsync(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);
  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  const destination = trip.destinations.id(req.params.destinationId);
  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
  }

  const validDestinationTransitions = {
    PENDING: ['ARRIVED'],
    ARRIVED: ['COMPLETED'],
    COMPLETED: [],
  };

  if (
    !validDestinationTransitions[destination.status] ||
    !validDestinationTransitions[destination.status].includes(req.body.status)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid destination status transition from ${destination.status} to ${req.body.status}`
    );
  }

  // Set actualArrival when arriving at destination
  if (req.body.status === 'ARRIVED' && !destination.actualArrival) {
    destination.actualArrival = new Date();
  }

  Object.assign(destination, req.body);
  await trip.save();

  res.send(trip);
});

const deleteTrip = catchAsync(async (req, res) => {
  await tripService.deleteTripById(req.params.tripId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  updateTripDestination,
  updateDestination,
  deleteTrip,
};
