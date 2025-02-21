const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const driverValidation = require('../../validations/driver.validation');
const driverController = require('../../controllers/driver.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageDrivers'), validate(driverValidation.createDriver), driverController.createDriver)
  .get(auth('getDrivers'), validate(driverValidation.getDrivers), driverController.getDrivers);

router
  .route('/:driverId')
  .get(auth('getDrivers'), validate(driverValidation.getDriver), driverController.getDriver)
  .patch(auth('manageDrivers'), validate(driverValidation.updateDriver), driverController.updateDriver)
  .delete(auth('manageDrivers'), validate(driverValidation.deleteDriver), driverController.deleteDriver);

module.exports = router;
