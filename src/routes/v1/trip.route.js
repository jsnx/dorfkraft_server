const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tripValidation = require('../../validations/trip.validation');
const tripController = require('../../controllers/trip.controller');
const { validateStatusTransition } = require('../../middlewares/validateStatusTransition');

const router = express.Router();

router
  .route('/')
  .post(auth('manageTrips'), validate(tripValidation.createTrip), tripController.createTrip)
  .get(auth('getTrips'), validate(tripValidation.getTrips), tripController.getTrips);

router
  .route('/:tripId')
  .get(auth('getTrips'), validate(tripValidation.getTrip), tripController.getTrip)
  .patch(auth('manageTrips'), validateStatusTransition, validate(tripValidation.updateTrip), tripController.updateTrip)
  .delete(auth('manageTrips'), validate(tripValidation.deleteTrip), tripController.deleteTrip);

router
  .route('/:tripId/destinations/:destinationId')
  .patch(auth('manageTrips'), validate(tripValidation.updateDestination), tripController.updateDestination);

module.exports = router;
