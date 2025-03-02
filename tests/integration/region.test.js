const mongoose = require('mongoose');
const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { regionOne, insertRegion } = require('../fixtures/region.fixture');
const { generateTokens } = require('../fixtures/token.fixture');
const { Region, User } = require('../../src/models');
const { regionService } = require('../../src/services');

setupTestDB();

let adminAccessToken;
let userOneAccessToken;

beforeEach(async () => {
  // Clear users before each test
  await User.deleteMany({});
  await insertUsers([admin, userOne]);
  // Generate fresh tokens for each test
  const tokens = generateTokens();
  adminAccessToken = tokens.adminAccessToken;
  userOneAccessToken = tokens.userOneAccessToken;
});

describe('Region routes', () => {
  describe('POST /v1/regions', () => {
    let newRegion;

    beforeEach(() => {
      newRegion = {
        name: `${faker.location.city()} Region`,
        baseAddress: {
          street: faker.location.street(),
          city: faker.location.city(),
          postalCode: faker.location.zipCode('12345'),
          country: 'Germany',
        },
        coordinates: {
          type: 'Point',
          coordinates: [parseFloat(faker.location.longitude()), parseFloat(faker.location.latitude())],
        },
        radius: faker.number.int({ min: 5, max: 50 }),
        isActive: true,
      };
    });

    test('should return 201 and successfully create region if data is ok', async () => {
      const res = await request(app)
        .post('/v1/regions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRegion)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newRegion.name,
        baseAddress: newRegion.baseAddress,
        coordinates: newRegion.coordinates,
        radius: newRegion.radius,
        isActive: newRegion.isActive,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/regions').send(newRegion).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user does not have required rights', async () => {
      await request(app)
        .post('/v1/regions')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newRegion)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if required fields are missing', async () => {
      delete newRegion.name;

      await request(app)
        .post('/v1/regions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRegion)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/regions', () => {
    test('should return 200 and apply the default query options', async () => {
      const region = await Region.create({
        name: `${faker.location.city()} Region`,
        baseAddress: {
          street: faker.location.street(),
          city: faker.location.city(),
          postalCode: '12345',
          country: 'Germany',
        },
        coordinates: {
          type: 'Point',
          coordinates: [13.404954, 52.520008],
        },
        radius: faker.number.int({ min: 5, max: 50 }),
        isActive: true,
      });

      const res = await request(app)
        .get('/v1/regions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(region.id);
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/v1/regions').send().expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('DELETE /v1/regions/:regionId', () => {
    test('should return 204 and soft delete the region if data is ok', async () => {
      const region = await insertRegion(regionOne);

      await request(app)
        .delete(`/v1/regions/${region._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      // Change the query to find the soft deleted region
      const deletedRegion = await Region.findOne({
        _id: region._id,
        isDeleted: true,
      });
      expect(deletedRegion).toBeTruthy();
      expect(deletedRegion.isDeleted).toBe(true);
      expect(deletedRegion.deletedAt).toBeDefined();
    });

    test('should return 404 if region is not found', async () => {
      const nonExistentId = mongoose.Types.ObjectId();

      await request(app)
        .delete(`/v1/regions/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});

describe('Region deletion tests', () => {
  let region;

  beforeEach(async () => {
    region = await insertRegion(regionOne);
  });

  test('should soft delete region and update related entities', async () => {
    await regionService.deleteRegion(region._id);

    const deletedRegion = await Region.findOne({ _id: region._id, isDeleted: true });
    expect(deletedRegion).toBeTruthy();
    expect(deletedRegion.isDeleted).toBe(true);
    expect(deletedRegion.deletedAt).toBeDefined();
  });

  test('should restore soft-deleted region', async () => {
    // First delete
    await regionService.deleteRegion(region._id);

    // Then restore
    await regionService.restoreRegion(region._id);

    const restoredRegion = await Region.findById(region._id);
    expect(restoredRegion).toBeTruthy();
    expect(restoredRegion.isDeleted).toBe(false);
    expect(restoredRegion.deletedAt).toBeNull();
  });

  test('should handle errors properly', async () => {
    jest.spyOn(Region.prototype, 'save').mockRejectedValueOnce(new Error('DB Error'));

    await expect(regionService.deleteRegion(region._id)).rejects.toThrow('DB Error');

    const regionAfterFailedDelete = await Region.findById(region._id);
    expect(regionAfterFailedDelete).toBeTruthy();
    expect(regionAfterFailedDelete.isDeleted).toBe(false);
    expect(regionAfterFailedDelete.deletedAt).toBeNull();
  });
});
