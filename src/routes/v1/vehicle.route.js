const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const vehicleValidation = require('../../validations/vehicle.validation');
const vehicleController = require('../../controllers/vehicle.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageVehicles'), validate(vehicleValidation.createVehicle), vehicleController.createVehicle)
  .get(auth('getVehicles'), validate(vehicleValidation.getVehicles), vehicleController.getVehicles);

router
  .route('/:vehicleId')
  .get(auth('getVehicles'), validate(vehicleValidation.getVehicle), vehicleController.getVehicle)
  .patch(auth('manageVehicles'), validate(vehicleValidation.updateVehicle), vehicleController.updateVehicle)
  .delete(auth('manageVehicles'), validate(vehicleValidation.deleteVehicle), vehicleController.deleteVehicle);

module.exports = router;
