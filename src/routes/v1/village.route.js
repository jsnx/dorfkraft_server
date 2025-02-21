const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const villageValidation = require('../../validations/village.validation');
const villageController = require('../../controllers/village.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageVillages'), validate(villageValidation.createVillage), villageController.createVillage)
  .get(auth('getVillages'), validate(villageValidation.getVillages), villageController.getVillages);

router
  .route('/:villageId')
  .get(auth('getVillages'), validate(villageValidation.getVillage), villageController.getVillage)
  .patch(auth('manageVillages'), validate(villageValidation.updateVillage), villageController.updateVillage)
  .delete(auth('manageVillages'), validate(villageValidation.deleteVillage), villageController.deleteVillage);

module.exports = router;
