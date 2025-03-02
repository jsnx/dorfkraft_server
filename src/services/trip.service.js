const httpStatus = require('http-status');
const { Trip, Vehicle, Driver } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a trip
 * @param {Object} tripBody
 * @returns {Promise<Trip>}
 */
const createTrip = async (tripBody) => {
  // Verify vehicle exists and is active
  const vehicle = await Vehicle.findById(tripBody.vehicle);
  if (!vehicle || !vehicle.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Vehicle not found or inactive');
  }

  // Verify driver exists and is active
  const driver = await Driver.findById(tripBody.driver);
  if (!driver || !driver.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Driver not found or inactive');
  }

  const trip = await Trip.create(tripBody);
  return Trip.findById(trip._id)
    .populate('vehicle')
    .populate('driver')
    .populate('destinations.village')
    .populate('destinations.products.product');
};

/**
 * Query for trips
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryTrips = async (filter, options) => {
  const trips = await Trip.paginate(filter, {
    ...options,
    populate: 'vehicle,driver,destinations.village,destinations.products.product',
  });
  return trips;
};

/**
 * Get trip by id
 * @param {ObjectId} id
 * @returns {Promise<Trip>}
 */
const getTripById = async (id) => {
  return Trip.findById(id)
    .populate('vehicle')
    .populate('driver')
    .populate('destinations.village')
    .populate('destinations.products.product');
};

/**
 * Update trip by id
 * @param {ObjectId} tripId
 * @param {Object} updateBody
 * @returns {Promise<Trip>}
 */
const updateTripById = async (tripId, updateBody) => {
  const trip = await getTripById(tripId);
  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  // Set actualStart when transitioning to IN_PROGRESS
  const updateData = { ...updateBody };
  if (updateBody.status === 'IN_PROGRESS' && !trip.actualStart) {
    updateData.actualStart = new Date().toISOString();
  }

  // Use findByIdAndUpdate with runValidators and context options
  const updatedTrip = await Trip.findByIdAndUpdate(
    tripId,
    { $set: updateData },
    {
      new: true, // Return the updated document
      runValidators: true, // Run validators only on updated paths
      context: 'query', // Required for update validators
    }
  );

  return updatedTrip;
};

/**
 * Update trip destination status
 * @param {ObjectId} tripId
 * @param {ObjectId} destinationId
 * @param {Object} updateBody
 * @returns {Promise<Trip>}
 */
const updateTripDestinationStatus = async (tripId, destinationId, updateBody) => {
  const trip = await getTripById(tripId);
  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  // Can't update destinations if trip is completed or cancelled
  if (['COMPLETED', 'CANCELLED'].includes(trip.status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot update destinations of ${trip.status} trip`);
  }

  const destination = trip.destinations.id(destinationId);
  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
  }

  // Define valid destination status transitions
  const validTransitions = {
    PENDING: ['ARRIVED', 'COMPLETED'],
    ARRIVED: ['COMPLETED'],
    COMPLETED: [],
  };

  if (!validTransitions[destination.status] || !validTransitions[destination.status].includes(updateBody.status)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid destination status transition from '${destination.status}' to '${updateBody.status}'`
    );
  }

  // Update destination status and set actualArrival if completing
  destination.status = updateBody.status;
  if (updateBody.status === 'COMPLETED' || updateBody.status === 'ARRIVED') {
    destination.actualArrival = new Date();
  }

  await trip.save();
  return getTripById(trip._id);
};

/**
 * Delete trip by id
 * @param {ObjectId} tripId
 * @returns {Promise<Trip>}
 */
const deleteTripById = async (tripId) => {
  const trip = await getTripById(tripId);
  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }
  if (trip.status !== 'PLANNED') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only planned trips can be deleted');
  }
  await trip.remove();
  return trip;
};

module.exports = {
  createTrip,
  queryTrips,
  getTripById,
  updateTripById,
  updateTripDestinationStatus,
  deleteTripById,
};
