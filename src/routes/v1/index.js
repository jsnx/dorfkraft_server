const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const healthRoute = require('./health.route');
const config = require('../../config/config');
const regionRoute = require('./region.route');
const villageRoute = require('./village.route');
const vehicleRoute = require('./vehicle.route');
const driverRoute = require('./driver.route');
const productRoute = require('./product.route');
const tripRoute = require('./trip.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/trips',
    route: tripRoute,
  },
  {
    path: '/health',
    route: healthRoute,
  },
  {
    path: '/regions',
    route: regionRoute,
  },
  {
    path: '/villages',
    route: villageRoute,
  },
  {
    path: '/vehicles',
    route: vehicleRoute,
  },
  {
    path: '/drivers',
    route: driverRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
