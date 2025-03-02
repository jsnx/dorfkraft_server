const mongoose = require('mongoose');
const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { vehicleOne, vehicleTwo, insertVehicles, insertVehicle } = require('../fixtures/vehicle.fixture');
const { generateTokens } = require('../fixtures/token.fixture');
const { Vehicle, Driver, User } = require('../../src/models');
const { driverOne, insertDriver } = require('../fixtures/driver.fixture');
const { vehicleService } = require('../../src/services');

setupTestDB();

let adminAccessToken;
let userOneAccessToken;

beforeEach(async () => {
  // Clear users before each test to avoid duplicates
  await User.deleteMany({});
  await insertUsers([admin, userOne]);
  const tokens = generateTokens();
  adminAccessToken = tokens.adminAccessToken;
  userOneAccessToken = tokens.userOneAccessToken;
});

describe('Vehicle routes', () => {
  describe('POST /v1/vehicles', () => {
    let newVehicle;

    beforeEach(() => {
      newVehicle = {
        registrationNumber: faker.string.alphanumeric(8).toUpperCase(),
        model: faker.vehicle.model(),
        capacity: {
          weight: faker.number.int({ min: 1000, max: 5000 }),
          volume: faker.number.float({ min: 10, max: 20, precision: 0.1 }),
        },
        status: 'AVAILABLE',
        currentLocation: {
          type: 'Point',
          coordinates: [
            parseFloat(faker.location.longitude()),
            parseFloat(faker.location.latitude()),
          ],
        },
        maintenanceSchedule: {
          lastService: new Date('2024-01-01'),
          nextService: new Date('2024-04-01'),
          serviceIntervalKm: 20000,
        },
        isActive: true,
      };
    });

    test('should return 201 and successfully create vehicle if data is ok', async () => {
      const res = await request(app)
        .post('/v1/vehicles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newVehicle)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        registrationNumber: newVehicle.registrationNumber,
        model: newVehicle.model,
        capacity: newVehicle.capacity,
        status: newVehicle.status,
        currentLocation: newVehicle.currentLocation,
        maintenanceSchedule: {
          lastService: newVehicle.maintenanceSchedule.lastService.toISOString(),
          nextService: newVehicle.maintenanceSchedule.nextService.toISOString(),
          serviceIntervalKm: newVehicle.maintenanceSchedule.serviceIntervalKm,
        },
        isActive: newVehicle.isActive,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/vehicles').send(newVehicle).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is not admin', async () => {
      await request(app)
        .post('/v1/vehicles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newVehicle)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/vehicles', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertVehicles([vehicleOne, vehicleTwo]);

      const res = await request(app)
        .get('/v1/vehicles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/v1/vehicles').send().expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/vehicles/:vehicleId', () => {
    test('should return 200 and the vehicle object if data is ok', async () => {
      await insertVehicles([vehicleOne]);

      const res = await request(app)
        .get(`/v1/vehicles/${vehicleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: vehicleOne._id.toHexString(),
        registrationNumber: vehicleOne.registrationNumber,
        model: vehicleOne.model,
        capacity: vehicleOne.capacity,
        status: vehicleOne.status,
        currentLocation: vehicleOne.currentLocation,
        maintenanceSchedule: {
          lastService: vehicleOne.maintenanceSchedule.lastService.toISOString(),
          nextService: vehicleOne.maintenanceSchedule.nextService.toISOString(),
          serviceIntervalKm: vehicleOne.maintenanceSchedule.serviceIntervalKm,
        },
        isActive: vehicleOne.isActive,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(`/v1/vehicles/${vehicleOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if vehicle is not found', async () => {
      await request(app)
        .get(`/v1/vehicles/${vehicleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/vehicles/:vehicleId', () => {
    test('should return 200 and successfully update vehicle if data is ok', async () => {
      await insertVehicles([vehicleOne]);

      const updateBody = {
        registrationNumber: faker.string.alphanumeric(8).toUpperCase(),
        model: faker.vehicle.model(),
        capacity: {
          weight: faker.number.int({ min: 1000, max: 5000 }),
          volume: faker.number.float({ min: 10, max: 20, precision: 0.1 }),
        },
      };

      const res = await request(app)
        .patch(`/v1/vehicles/${vehicleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: vehicleOne._id.toHexString(),
        registrationNumber: updateBody.registrationNumber,
        model: updateBody.model,
        capacity: updateBody.capacity,
        status: vehicleOne.status,
        currentLocation: vehicleOne.currentLocation,
        maintenanceSchedule: {
          lastService: vehicleOne.maintenanceSchedule.lastService.toISOString(),
          nextService: vehicleOne.maintenanceSchedule.nextService.toISOString(),
          serviceIntervalKm: vehicleOne.maintenanceSchedule.serviceIntervalKm,
        },
        isActive: vehicleOne.isActive,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).patch(`/v1/vehicles/${vehicleOne._id}`).send({}).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is not admin', async () => {
      await request(app)
        .patch(`/v1/vehicles/${vehicleOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ model: faker.vehicle.model() || faker.commerce.productName() })
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if vehicle is not found', async () => {
      await request(app)
        .patch(`/v1/vehicles/${vehicleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ model: faker.vehicle.model() || faker.commerce.productName() })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/vehicles/:vehicleId', () => {
    test('should return 204 and soft delete the vehicle if data is ok', async () => {
      const vehicle = await insertVehicle(vehicleOne);

      await request(app)
        .delete(`/v1/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const deletedVehicle = await Vehicle.findOne({
        _id: vehicle._id,
        isDeleted: true,
      });
      expect(deletedVehicle).toBeTruthy();
      expect(deletedVehicle.isDeleted).toBe(true);
      expect(deletedVehicle.deletedAt).toBeDefined();
    });

    test('should return 404 if vehicle is not found', async () => {
      const nonExistentId = mongoose.Types.ObjectId();

      await request(app)
        .delete(`/v1/vehicles/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});

describe('Vehicle deletion tests', () => {
  test('should soft delete vehicle and update related drivers', async () => {
    // Create a vehicle and driver
    const vehicle = await insertVehicle(vehicleOne);
    const driver = await insertDriver({
      ...driverOne,
      vehicle: vehicle._id,
    });

    // Ensure the driver has the vehicle assigned
    expect(driver.vehicle).toEqual(vehicle._id);

    // Delete the vehicle
    await vehicleService.deleteVehicleById(vehicle._id);

    // Check that the vehicle is soft deleted
    const deletedVehicle = await Vehicle.findOne({
      _id: vehicle._id,
      isDeleted: true,
    });
    expect(deletedVehicle).toBeDefined();
    expect(deletedVehicle.isDeleted).toBe(true);
    expect(deletedVehicle.deletedAt).toBeDefined();

    // Check that the driver's vehicle reference is removed
    const updatedDriver = await Driver.findById(driver._id);
    expect(updatedDriver.vehicle).toBeUndefined();
  });
});
