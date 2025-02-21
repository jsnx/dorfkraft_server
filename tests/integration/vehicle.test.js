const mongoose = require('mongoose');
const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { vehicleOne, vehicleTwo, insertVehicles, insertVehicle } = require('../fixtures/vehicle.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { Vehicle, Driver } = require('../../src/models');
const { driverOne, insertDriver } = require('../fixtures/driver.fixture');
const { vehicleService } = require('../../src/services');

setupTestDB();

describe('Vehicle routes', () => {
  describe('POST /v1/vehicles', () => {
    let newVehicle;

    beforeEach(() => {
      newVehicle = {
        registrationNumber: faker.random.alphaNumeric(8),
        model: faker.vehicle.model(),
        capacity: faker.datatype.number({ min: 100, max: 5000 }),
        status: 'available',
        currentLocation: {
          type: 'Point',
          coordinates: [parseFloat(faker.address.longitude()), parseFloat(faker.address.latitude())],
        },
        isActive: true,
      };
    });

    test('should return 201 and successfully create vehicle if data is ok', async () => {
      await insertUsers([admin]);

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
        isActive: newVehicle.isActive,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/vehicles').send(newVehicle).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/vehicles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newVehicle)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/vehicles', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
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
      await insertUsers([admin]);
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
        isActive: vehicleOne.isActive,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(`/v1/vehicles/${vehicleOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if vehicle is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .get(`/v1/vehicles/${vehicleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/vehicles/:vehicleId', () => {
    test('should return 200 and successfully update vehicle if data is ok', async () => {
      await insertUsers([admin]);
      await insertVehicles([vehicleOne]);

      const updateBody = {
        registrationNumber: faker.random.alphaNumeric(8),
        model: faker.vehicle.model(),
        capacity: faker.datatype.number({ min: 100, max: 5000 }),
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
        isActive: vehicleOne.isActive,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).patch(`/v1/vehicles/${vehicleOne._id}`).send({}).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is not admin', async () => {
      await insertUsers([userOne]);
      await insertVehicles([vehicleOne]);

      await request(app)
        .patch(`/v1/vehicles/${vehicleOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ model: faker.vehicle.model() })
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if vehicle is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .patch(`/v1/vehicles/${vehicleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ model: faker.vehicle.model() })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/vehicles/:vehicleId', () => {
    test('should return 204 and soft delete the vehicle if data is ok', async () => {
      await insertUsers([admin]);
      const vehicle = await insertVehicle(vehicleOne);

      await request(app)
        .delete(`/v1/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const deletedVehicle = await Vehicle.findOne({ 
        _id: vehicle._id,
        isDeleted: true 
      });
      expect(deletedVehicle).toBeTruthy();
      expect(deletedVehicle.isDeleted).toBe(true);
      expect(deletedVehicle.deletedAt).toBeDefined();
    });

    test('should return 404 if vehicle is not found', async () => {
      await insertUsers([admin]);
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
  let vehicle;
  let driver;

  beforeEach(async () => {
    vehicle = await insertVehicle(vehicleOne);
    driver = await insertDriver({
      ...driverOne,
      vehicle: vehicle._id,
    });
  });

  test('should soft delete vehicle and update related drivers', async () => {
    await vehicleService.deleteVehicle(vehicle._id);

    const deletedVehicle = await Vehicle.findOne({ 
      _id: vehicle._id,
      isDeleted: true 
    });
    expect(deletedVehicle).toBeTruthy();
    expect(deletedVehicle.isDeleted).toBe(true);
    expect(deletedVehicle.deletedAt).toBeDefined();

    const updatedDriver = await Driver.findById(driver._id);
    expect(updatedDriver.vehicle).toBeUndefined();
  });

  test('should prevent deletion of vehicle with active driver', async () => {
    await Driver.findByIdAndUpdate(driver._id, { status: 'on-duty' });
    
    await expect(vehicleService.deleteVehicle(vehicle._id))
      .rejects
      .toThrow('Cannot delete vehicle assigned to active driver');

    const vehicleAfterFailedDelete = await Vehicle.findById(vehicle._id);
    expect(vehicleAfterFailedDelete).toBeTruthy();
    expect(vehicleAfterFailedDelete.isDeleted).toBe(false);
    expect(vehicleAfterFailedDelete.deletedAt).toBeNull();
  });

  test('should handle errors properly', async () => {
    jest.spyOn(Vehicle.prototype, 'save').mockRejectedValueOnce(new Error('DB Error'));
    await expect(vehicleService.deleteVehicle(vehicle._id)).rejects.toThrow('DB Error');

    const vehicleAfterFailedDelete = await Vehicle.findById(vehicle._id);
    expect(vehicleAfterFailedDelete).toBeTruthy();
    expect(vehicleAfterFailedDelete.isDeleted).toBe(false);
    expect(vehicleAfterFailedDelete.deletedAt).toBeNull();
  });

  test('should restore soft-deleted vehicle', async () => {
    await vehicleService.deleteVehicle(vehicle._id);
    await vehicleService.restoreVehicle(vehicle._id);

    const restoredVehicle = await Vehicle.findById(vehicle._id);
    expect(restoredVehicle).toBeTruthy();
    expect(restoredVehicle.isDeleted).toBe(false);
    expect(restoredVehicle.deletedAt).toBeNull();
  });
});
