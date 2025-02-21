const mongoose = require('mongoose');
const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Product } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { productOne, insertProduct } = require('../fixtures/product.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Product routes', () => {
  describe('POST /v1/products', () => {
    let newProduct;

    beforeEach(() => {
      newProduct = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        unit: 'kg',
        unitPrice: parseFloat(faker.commerce.price()),
        currentStock: faker.number.int({ min: 10, max: 1000 }),
        isActive: true,
      };
    });

    test('should return 201 and successfully create product if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newProduct.name,
        description: newProduct.description,
        unit: newProduct.unit,
        unitPrice: newProduct.unitPrice,
        currentStock: newProduct.currentStock,
        isActive: true,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/products').send(newProduct).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/products', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertProduct(productOne);

      const res = await request(app)
        .get('/v1/products')
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
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/v1/products').send().expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/products/:productId', () => {
    test('should return 200 and the product object if data is ok', async () => {
      await insertUsers([admin]);
      await insertProduct(productOne);

      const res = await request(app)
        .get(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: productOne._id.toHexString(),
        name: productOne.name,
        description: productOne.description,
        unit: productOne.unit,
        unitPrice: productOne.unitPrice,
        currentStock: productOne.currentStock,
        isActive: productOne.isActive,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(`/v1/products/${productOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if product is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .get(`/v1/products/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/products/:productId', () => {
    test('should return 200 and successfully update product if data is ok', async () => {
      await insertUsers([admin]);
      await insertProduct(productOne);

      const updateBody = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        unitPrice: parseFloat(faker.commerce.price()),
        currentStock: faker.number.int({ min: 10, max: 1000 }),
      };

      const res = await request(app)
        .patch(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: productOne._id.toHexString(),
        name: updateBody.name,
        description: updateBody.description,
        unit: productOne.unit,
        unitPrice: updateBody.unitPrice,
        currentStock: updateBody.currentStock,
        isActive: productOne.isActive,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).patch(`/v1/products/${productOne._id}`).send({}).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is not admin', async () => {
      await insertUsers([userOne]);
      await insertProduct(productOne);

      await request(app)
        .patch(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ name: faker.commerce.productName() })
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if product is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .patch(`/v1/products/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ name: faker.commerce.productName() })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/products/:productId', () => {
    test('should return 204 and delete the product', async () => {
      await insertUsers([admin]);
      const product = await insertProduct(productOne);

      await request(app)
        .delete(`/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbProduct = await Product.findById(product._id);
      expect(dbProduct).toBeNull();
    });

    test('should return 404 if product is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .delete(`/v1/products/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
