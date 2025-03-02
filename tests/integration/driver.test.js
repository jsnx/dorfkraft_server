const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Driver } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { driverOne, insertDriver } = require('../fixtures/driver.fixture');
const { generateTokens } = require('../fixtures/token.fixture');

setupTestDB();

let adminAccessToken;
let userOneAccessToken;

beforeEach(async () => {
  await insertUsers([admin, userOne]);
  const tokens = generateTokens();
  adminAccessToken = tokens.adminAccessToken;
  userOneAccessToken = tokens.userOneAccessToken;
});

describe('Driver routes', () => {
  describe('POST /v1/drivers', () => {
    let newDriver;

    beforeEach(() => {
      newDriver = {
        user: userOne._id,
        name: faker.person.fullName(),
        licenseNumber: faker.string.alphanumeric(8).toUpperCase(),
        licenseExpiry: new Date('2024-12-31'),
        status: 'available',
        isActive: true,
      };
    });

    test('should return 201 and successfully create driver if data is ok', async () => {
      const res = await request(app).post('/v1/drivers').set('Authorization', `Bearer ${adminAccessToken}`).send(newDriver);

      // Temporarily log the error if status is not 201
      // console.log('Error response:', res.body);

      expect(res.status).toBe(httpStatus.CREATED);
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newDriver.name,
        licenseNumber: newDriver.licenseNumber,
        licenseExpiry: newDriver.licenseExpiry.toISOString(),
        status: newDriver.status,
        isActive: newDriver.isActive,
        user: newDriver.user.toHexString(),
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/drivers').send(newDriver).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is not admin', async () => {
      await request(app)
        .post('/v1/drivers')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newDriver)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/drivers', () => {
    test('should return 200 and apply the default query options', async () => {
      const driver = await insertDriver(driverOne);

      const res = await request(app)
        .get('/v1/drivers')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: [
          {
            id: driver._id.toHexString(),
            name: driver.name,
            licenseNumber: driver.licenseNumber,
            licenseExpiry: driver.licenseExpiry.toISOString(),
            status: driver.status,
            isActive: driver.isActive,
            user: driver.user.toHexString(),
            isDeleted: false,
            deletedAt: null,
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/v1/drivers').send().expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/drivers/:driverId', () => {
    test('should return 200 and the driver object if data is ok', async () => {
      const driver = await insertDriver(driverOne);

      const res = await request(app)
        .get(`/v1/drivers/${driver._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: driver._id.toHexString(),
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseExpiry: driver.licenseExpiry.toISOString(),
        status: driver.status,
        isActive: driver.isActive,
        user: driver.user.toHexString(),
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(`/v1/drivers/${driverOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if driver is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .get(`/v1/drivers/${driverOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/drivers/:driverId', () => {
    test('should return 200 and successfully update driver if data is ok', async () => {
      const driver = await insertDriver(driverOne);

      const updateBody = {
        licenseNumber: faker.string.alphanumeric(8).toUpperCase(),
        status: 'on-duty',
      };

      const res = await request(app)
        .patch(`/v1/drivers/${driver._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: driver._id.toHexString(),
        name: driver.name,
        licenseNumber: updateBody.licenseNumber,
        licenseExpiry: driver.licenseExpiry.toISOString(),
        status: updateBody.status,
        isActive: driver.isActive,
        user: driver.user.toHexString(),
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).patch(`/v1/drivers/${driverOne._id}`).send({}).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is not admin', async () => {
      const driver = await insertDriver(driverOne);

      await request(app)
        .patch(`/v1/drivers/${driver._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ status: 'on-duty' })
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if driver is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .patch(`/v1/drivers/${driverOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'on-duty' })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/drivers/:driverId', () => {
    test('should return 204 and soft delete the driver if data is ok', async () => {
      const driver = await insertDriver(driverOne);

      await request(app)
        .delete(`/v1/drivers/${driver._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      // Use findWithDeleted to get all documents including deleted ones
      const deletedDriver = await Driver.findOne({ _id: driver._id, isDeleted: true });
      expect(deletedDriver).toBeDefined();
      expect(deletedDriver.isDeleted).toBe(true);
      expect(deletedDriver.deletedAt).toBeDefined();
    });
  });
});
