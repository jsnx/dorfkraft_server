const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');

// Import models directly
const User = require('../models/user.model');
const Region = require('../models/region.model');
const Village = require('../models/village.model');
const Vehicle = require('../models/vehicle.model');
const Driver = require('../models/driver.model');
const Product = require('../models/product.model');
const Trip = require('../models/trip.model');
const TripProduct = require('../models/tripProduct.model');
const Forecast = require('../models/forecast.model');
const SalesRecord = require('../models/salesRecord.model');
const Destination = require('../models/destination.model');

// Import seed data
const { USERS } = require('./constants/users');
const { VEHICLES } = require('./constants/vehicles');
const { DRIVERS } = require('./constants/drivers');
const { PRODUCTS } = require('./constants/products');
const { BAKERY_HQ, VILLAGES } = require('./constants/locations');
const { REGIONS } = require('./constants/regions');

async function clearDatabase() {
  try {
    // Verify models are properly loaded
    const models = [SalesRecord, TripProduct, Trip, Destination, Driver, Vehicle, Product, Forecast, Village, Region, User];

    // Check if any model is undefined
    const undefinedModels = models.filter((model) => !model);
    if (undefinedModels.length > 0) {
      throw new Error(`Some models are undefined: ${undefinedModels.join(', ')}`);
    }

    // Clear in specific order due to dependencies
    await Promise.all([
      SalesRecord.deleteMany({}),
      TripProduct.deleteMany({}),
      Destination.deleteMany({}),
      Trip.deleteMany({}),
      Driver.deleteMany({}),
      Vehicle.deleteMany({}),
      Product.deleteMany({}),
      Forecast.deleteMany({}),
      Village.deleteMany({}),
      Region.deleteMany({}),
      User.deleteMany({}),
    ]);

    // Verify everything is cleared
    const counts = await Promise.all([
      User.countDocuments(),
      Region.countDocuments(),
      Village.countDocuments(),
      Vehicle.countDocuments(),
      Driver.countDocuments(),
      Product.countDocuments(),
      Trip.countDocuments(),
      TripProduct.countDocuments(),
      Forecast.countDocuments(),
      SalesRecord.countDocuments(),
    ]);

    if (counts.some((count) => count !== 0)) {
      throw new Error('Database not properly cleared');
    }

    logger.info('Database cleared successfully');
  } catch (error) {
    logger.error('Failed to clear database:', error);
    throw error;
  }
}

async function verifySeeding() {
  const adminUser = await User.findOne({ email: 'admin@example.com' });
  if (!adminUser) {
    logger.error('Admin user not found in database!');
    return false;
  }
  logger.info(`Found admin user: ${adminUser.email} with password hash: ${adminUser.password}`);
  return true;
}

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    // Clear database first
    await clearDatabase();

    // Create all users
    const createdUsers = {};
    await Promise.all(
      USERS.map(async (userData) => {
        logger.info(`Creating user ${userData.email} with password ${userData.password}`);
        const user = await User.create({
          ...userData,
        });
        createdUsers[user.email] = user;

        // Test password match immediately
        const passwordMatch = await user.isPasswordMatch(userData.password);
        logger.info(`Immediate password verification for ${user.email}: ${passwordMatch}`);
      })
    );

    // Create regions
    const createdRegions = {};
    await Promise.all(
      REGIONS.map(async (regionData) => {
        const region = await Region.create({
          name: regionData.name,
          baseAddress: {
            street: BAKERY_HQ.address.split(',')[0],
            city: regionData.name,
            postalCode: '80000',
            country: 'Germany',
          },
          coordinates: {
            type: 'Point',
            coordinates: [regionData.center.longitude, regionData.center.latitude],
          },
          radius: 30, // Default radius in km
          isActive: true,
        });
        createdRegions[region.name] = region;
        logger.info(`Created region: ${region.name}`);
      })
    );

    // Create villages
    const createdVillages = {};
    await Promise.all(
      VILLAGES.map(async (villageData) => {
        const region = createdRegions[villageData.region.name];
        if (!region) {
          throw new Error(`Region not found for village: ${villageData.name}`);
        }

        const village = await Village.create({
          name: villageData.name,
          region: region._id,
          inhabitants: villageData.population,
          coordinates: {
            type: 'Point',
            coordinates: [villageData.coordinates.longitude, villageData.coordinates.latitude],
          },
          isActive: true,
        });
        createdVillages[village.name] = village;
        logger.info(`Created village: ${village.name}`);
      })
    );

    // Create products
    const createdProducts = {};
    await Promise.all(
      PRODUCTS.map(async (productData) => {
        const product = await Product.create({
          name: productData.name,
          category: productData.category,
          description: `Fresh ${productData.name}`,
          unit: productData.unit,
          weight: productData.weight,
          volume: productData.volume,
          unitPrice: productData.price,
          currentStock: 1000, // Default initial stock
          shelfLife: productData.shelfLife,
          productionCost: productData.productionCost,
          isSeasonalOnly: productData.isSeasonalOnly,
          isActive: true,
        });
        createdProducts[product.name] = product;
        logger.info(`Created product: ${product.name}`);
      })
    );

    // Create vehicles
    const createdVehicles = {};
    await Promise.all(
      VEHICLES.map(async (vehicleData) => {
        const vehicle = await Vehicle.create({
          registrationNumber: vehicleData.registrationNumber,
          model: vehicleData.model,
          capacity: {
            weight: vehicleData.capacity.weight,
            volume: vehicleData.capacity.volume,
          },
          status: 'AVAILABLE',
          currentLocation: {
            type: 'Point',
            coordinates: [BAKERY_HQ.coordinates.longitude, BAKERY_HQ.coordinates.latitude],
          },
          maintenanceSchedule: {
            lastService: new Date(vehicleData.maintenanceSchedule.lastService),
            nextService: new Date(vehicleData.maintenanceSchedule.nextService),
            serviceIntervalKm: vehicleData.maintenanceSchedule.serviceIntervalKm,
          },
          isActive: true,
        });
        createdVehicles[vehicle.registrationNumber] = vehicle;
        logger.info(`Created vehicle: ${vehicle.registrationNumber}`);
      })
    );

    // Create drivers
    await Promise.all(
      DRIVERS.map(async (driverData) => {
        const driverUser = createdUsers[driverData.contact.email];
        if (!driverUser) {
          throw new Error(`Driver user not found: ${driverData.contact.email}`);
        }

        const driver = await Driver.create({
          user: driverUser._id,
          name: driverData.name,
          licenseNumber: driverData.licenseNumber,
          licenseExpiry: new Date('2024-12-31'),
          status: 'available',
          isActive: true,
        });
        logger.info(`Created driver: ${driver.name} with user ${driverUser.email}`);
      })
    );

    await verifySeeding();
    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Failed to seed database:', error);
    throw error;
  }
}

module.exports = {
  clearDatabase,
  seedDatabase,
}; 