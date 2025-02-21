const mongoose = require('mongoose');
const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Trip } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { tripOne, tripTwo, insertTrips } = require('../fixtures/trip.fixture');
const { insertVehicle, vehicleOne } = require('../fixtures/vehicle.fixture');
const { insertDriver, driverOne } = require('../fixtures/driver.fixture');
const { insertVillage, villageOne } = require('../fixtures/village.fixture');
const { insertProduct, productOne } = require('../fixtures/product.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Trip routes', () => {
  describe('POST /v1/trips', () => {
    let newTrip;

    beforeEach(async () => {
      const vehicle = await insertVehicle({
        ...vehicleOne,
        _id: vehicleOne._id,
      });

      await insertDriver(driverOne);
      await insertVillage(villageOne);
      await insertProduct(productOne);

      newTrip = {
        vehicle: vehicle._id,
        driver: driverOne._id,
        startLocation: {
          type: 'Point',
          coordinates: [13.405, 52.52],
          address: {
            street: faker.location.street(),
            city: faker.location.city(),
            postalCode: faker.location.zipCode(),
            country: 'Germany',
          },
        },
        destinations: [
          {
            location: {
              type: 'Point',
              coordinates: [13.505, 52.62],
              address: {
                street: faker.location.street(),
                city: faker.location.city(),
                postalCode: faker.location.zipCode(),
                country: 'Germany',
              },
            },
            village: villageOne._id,
            products: [
              {
                product: productOne._id,
                quantity: faker.number.int({ min: 1, max: 100 }),
              },
            ],
            estimatedArrival: faker.date.future(),
          },
        ],
        scheduledStart: faker.date.future(),
      };
    });

    test('should return 201 and successfully create trip if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/trips')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTrip)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        vehicle: expect.objectContaining({
          id: newTrip.vehicle.toHexString(),
          registrationNumber: expect.any(String),
          model: expect.any(String),
          capacity: expect.any(Number),
          status: expect.any(String),
          isActive: expect.any(Boolean),
        }),
        driver: expect.objectContaining({
          id: newTrip.driver.toHexString(),
          name: expect.any(String),
          licenseNumber: expect.any(String),
          status: expect.any(String),
          isActive: expect.any(Boolean),
        }),
        startLocation: expect.any(Object),
        destinations: expect.any(Array),
        scheduledStart: expect.any(String),
        status: 'scheduled',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const dbTrip = await Trip.findById(res.body.id);
      expect(dbTrip).toBeDefined();
      expect(dbTrip).toMatchObject({
        vehicle: newTrip.vehicle,
        driver: newTrip.driver,
        status: 'scheduled',
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/trips').send(newTrip).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/trips')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newTrip)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if vehicle is not found', async () => {
      await insertUsers([admin]);
      newTrip.vehicle = mongoose.Types.ObjectId();

      await request(app)
        .post('/v1/trips')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTrip)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if driver is not found', async () => {
      await insertUsers([admin]);
      newTrip.driver = mongoose.Types.ObjectId();

      await request(app)
        .post('/v1/trips')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTrip)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/trips', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertVehicle(vehicleOne);
      await insertDriver(driverOne);
      await insertTrips([tripOne, tripTwo]);

      const res = await request(app)
        .get('/v1/trips')
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
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toEqual({
        id: tripOne._id.toHexString(),
        vehicle: expect.objectContaining({
          id: tripOne.vehicle.toHexString(),
          registrationNumber: expect.any(String),
          model: expect.any(String),
          capacity: expect.any(Number),
          status: expect.any(String),
          isActive: expect.any(Boolean),
        }),
        driver: expect.objectContaining({
          id: tripOne.driver.toHexString(),
          name: expect.any(String),
          licenseNumber: expect.any(String),
          status: expect.any(String),
          isActive: expect.any(Boolean),
        }),
        status: tripOne.status,
        scheduledStart: tripOne.scheduledStart.toISOString(),
        startLocation: expect.any(Object),
        destinations: expect.any(Array),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/v1/trips').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should correctly apply filter on status field', async () => {
      await insertUsers([admin]);
      await insertTrips([tripOne, tripTwo]);

      const res = await request(app)
        .get('/v1/trips')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ status: tripOne.status })
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
      expect(res.body.results[0].id).toBe(tripOne._id.toHexString());
    });
  });

  describe('GET /v1/trips/:tripId', () => {
    test('should return 200 and the trip object if data is ok', async () => {
      await insertUsers([admin]);
      await insertVehicle(vehicleOne);
      await insertDriver(driverOne);
      await insertTrips([tripOne]);

      const res = await request(app)
        .get(`/v1/trips/${tripOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: tripOne._id.toHexString(),
        vehicle: expect.objectContaining({
          id: tripOne.vehicle.toHexString(),
          registrationNumber: expect.any(String),
          model: expect.any(String),
          capacity: expect.any(Number),
          status: expect.any(String),
          isActive: expect.any(Boolean),
        }),
        driver: expect.objectContaining({
          id: tripOne.driver.toHexString(),
          name: expect.any(String),
          licenseNumber: expect.any(String),
          status: expect.any(String),
          isActive: expect.any(Boolean),
        }),
        status: tripOne.status,
        scheduledStart: tripOne.scheduledStart.toISOString(),
        startLocation: expect.any(Object),
        destinations: expect.any(Array),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertTrips([tripOne]);

      await request(app).get(`/v1/trips/${tripOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if trip is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .get(`/v1/trips/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/trips/:tripId', () => {
    test('should return 200 and successfully update trip if data is ok', async () => {
      await insertUsers([admin]);
      await insertVehicle(vehicleOne);
      await insertDriver(driverOne);
      await insertTrips([tripOne]);

      const tripBeforeUpdate = await Trip.findById(tripOne._id);
      console.log('Trip before update:', {
        id: tripOne._id,
        status: tripBeforeUpdate?.status,
      });

      const updateBody = {
        status: 'in_progress',
        notes: 'Updated trip notes',
      };

      const res = await request(app)
        .patch(`/v1/trips/${tripOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody);

      console.log('Error response:', res.body);

      expect(res.status).toBe(httpStatus.OK);

      expect(res.body).toMatchObject({
        id: tripOne._id.toHexString(),
        status: updateBody.status,
        notes: updateBody.notes,
        actualStart: expect.any(String),
      });

      const dbTrip = await Trip.findById(tripOne._id);
      expect(dbTrip).toBeDefined();
      expect(dbTrip).toMatchObject({ status: updateBody.status, notes: updateBody.notes });
    });

    test('should return 404 if trip is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .patch(`/v1/trips/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'in_progress' })
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if status transition is invalid', async () => {
      await insertUsers([admin]);
      await insertTrips([tripTwo]); // tripTwo is already in_progress

      await request(app)
        .patch(`/v1/trips/${tripTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'scheduled' })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/trips/:tripId/destinations/:destinationId', () => {
    test('should return 200 and successfully update destination status', async () => {
      await insertUsers([admin]);
      await insertVehicle(vehicleOne);
      await insertDriver(driverOne);
      await insertTrips([tripOne]);

      const destinationId = tripOne.destinations[0]._id;
      const updateBody = {
        status: 'arrived',
      };

      const res = await request(app)
        .patch(`/v1/trips/${tripOne._id}/destinations/${destinationId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body.destinations[0]).toMatchObject({
        status: updateBody.status,
        actualArrival: expect.any(String),
      });

      const dbTrip = await Trip.findById(tripOne._id);
      expect(dbTrip.destinations[0].status).toBe(updateBody.status);
      expect(dbTrip.destinations[0].actualArrival).toBeDefined();
    });

    test('should return 404 if trip is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .patch(`/v1/trips/${mongoose.Types.ObjectId()}/destinations/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'completed' })
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 if destination is not found', async () => {
      await insertUsers([admin]);
      await insertTrips([tripOne]);

      await request(app)
        .patch(`/v1/trips/${tripOne._id}/destinations/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'completed' })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/trips/:tripId', () => {
    test('should return 204 and delete trip if data is ok', async () => {
      await insertUsers([admin]);
      await insertTrips([tripOne]);

      await request(app)
        .delete(`/v1/trips/${tripOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbTrip = await Trip.findById(tripOne._id);
      expect(dbTrip).toBeNull();
    });

    test('should return 404 if trip is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .delete(`/v1/trips/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 if trip is not in scheduled status', async () => {
      await insertUsers([admin]);
      await insertTrips([tripTwo]); // tripTwo is in_progress

      await request(app)
        .delete(`/v1/trips/${tripTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
