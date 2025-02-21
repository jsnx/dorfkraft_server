const mongoose = require('mongoose');
const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { villageOne, villageTwo, insertVillages, insertVillage } = require('../fixtures/village.fixture');
const { driverOne, insertDriver } = require('../fixtures/driver.fixture');
const { regionOne } = require('../fixtures/region.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { Village, Driver } = require('../../src/models');
const { villageService } = require('../../src/services');

setupTestDB();

describe('Village routes', () => {
  describe('POST /v1/villages', () => {
    let newVillage;

    beforeEach(() => {
      newVillage = {
        name: faker.location.city(),
        region: regionOne._id,
        inhabitants: faker.number.int({ min: 100, max: 10000 }),
        coordinates: {
          type: 'Point',
          coordinates: [
            parseFloat(faker.location.longitude()),
            parseFloat(faker.location.latitude())
          ],
        },
        isActive: true,
      };
    });

    test('should return 201 and successfully create village if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/villages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newVillage)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newVillage.name,
        region: newVillage.region.toHexString(),
        inhabitants: newVillage.inhabitants,
        coordinates: newVillage.coordinates,
        isActive: newVillage.isActive,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/villages').send(newVillage).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/villages')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newVillage)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/villages', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertVillages([villageOne, villageTwo]);

      const res = await request(app)
        .get('/v1/villages')
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
      await request(app).get('/v1/villages').send().expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/villages/:villageId', () => {
    test('should return 200 and the village object if data is ok', async () => {
      await insertUsers([admin]);
      const village = await insertVillage(villageOne);

      const res = await request(app)
        .get(`/v1/villages/${village._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: village._id.toHexString(),
        name: village.name,
        region: village.region.toHexString(),
        inhabitants: village.inhabitants,
        coordinates: {
          type: 'Point',
          coordinates: expect.any(Array),
        },
        isActive: village.isActive,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(`/v1/villages/${villageOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if village is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .get(`/v1/villages/${villageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/villages/:villageId', () => {
    test('should return 200 and successfully update village if data is ok', async () => {
      await insertUsers([admin]);
      const village = await insertVillage(villageOne);

      const updateBody = {
        name: faker.location.city(),
        inhabitants: faker.number.int({ min: 100, max: 10000 }),
      };

      const res = await request(app)
        .patch(`/v1/villages/${village._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: village._id.toHexString(),
        name: updateBody.name,
        region: village.region.toHexString(),
        inhabitants: updateBody.inhabitants,
        coordinates: {
          type: 'Point',
          coordinates: expect.any(Array),
        },
        isActive: true,
        isDeleted: false,
        deletedAt: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).patch(`/v1/villages/${villageOne._id}`).send({}).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is not admin', async () => {
      await insertUsers([userOne]);
      await insertVillages([villageOne]);

      await request(app)
        .patch(`/v1/villages/${villageOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ name: faker.location.city() })
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if village is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .patch(`/v1/villages/${villageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ name: faker.location.city() })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/villages/:villageId', () => {
    test('should return 204 and soft delete the village if data is ok', async () => {
      await insertUsers([admin]);
      const village = await insertVillage(villageOne);

      await request(app)
        .delete(`/v1/villages/${village._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const deletedVillage = await Village.findOne({ 
        _id: village._id,
        isDeleted: true 
      });
      expect(deletedVillage).toBeTruthy();
      expect(deletedVillage.isDeleted).toBe(true);
      expect(deletedVillage.deletedAt).toBeDefined();
    });

    test('should return 404 if village is not found', async () => {
      await insertUsers([admin]);
      const nonExistentId = mongoose.Types.ObjectId();

      await request(app)
        .delete(`/v1/villages/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});

describe('Village deletion tests', () => {
  let village;
  let driver;

  beforeEach(async () => {
    village = await insertVillage(villageOne);
    driver = await insertDriver({
      ...driverOne,
      village: village._id,
    });
  });

  test('should soft delete village and update related drivers', async () => {
    await villageService.deleteVillage(village._id);

    const deletedVillage = await Village.findOne({ 
      _id: village._id,
      isDeleted: true 
    });
    expect(deletedVillage).toBeTruthy();
    expect(deletedVillage.isDeleted).toBe(true);
    expect(deletedVillage.deletedAt).toBeDefined();

    const updatedDriver = await Driver.findById(driver._id);
    expect(updatedDriver.village).toBeUndefined();
  });

  test('should restore soft-deleted village', async () => {
    await villageService.deleteVillage(village._id);
    await villageService.restoreVillage(village._id);

    const restoredVillage = await Village.findById(village._id);
    expect(restoredVillage).toBeTruthy();
    expect(restoredVillage.isDeleted).toBe(false);
    expect(restoredVillage.deletedAt).toBeNull();
  });

  test('should handle errors properly', async () => {
    jest.spyOn(Village.prototype, 'save').mockRejectedValueOnce(new Error('DB Error'));
    await expect(villageService.deleteVillage(village._id)).rejects.toThrow('DB Error');

    const villageAfterFailedDelete = await Village.findById(village._id);
    expect(villageAfterFailedDelete).toBeTruthy();
    expect(villageAfterFailedDelete.isDeleted).toBe(false);
    expect(villageAfterFailedDelete.deletedAt).toBeNull();
  });
});
