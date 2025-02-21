const express = require('express');
const healthController = require('../../../src/controllers/health.controller');

const router = express.Router();

router.get('/', healthController.healthCheck);

module.exports = router;