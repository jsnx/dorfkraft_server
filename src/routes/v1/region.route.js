const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const regionValidation = require('../../validations/region.validation');
const regionController = require('../../controllers/region.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageRegions'), validate(regionValidation.createRegion), regionController.createRegion)
  .get(auth('getRegions'), validate(regionValidation.getRegions), regionController.getRegions);

router
  .route('/:regionId')
  .get(auth('getRegions'), validate(regionValidation.getRegion), regionController.getRegion)
  .patch(auth('manageRegions'), validate(regionValidation.updateRegion), regionController.updateRegion)
  .delete(auth('manageRegions'), validate(regionValidation.deleteRegion), regionController.deleteRegion);

module.exports = router; 