const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'node-express-boilerplate API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
  paths: {
    '/villages': {
      post: {
        summary: 'Create a village',
        description: 'Only admins can create villages.',
        tags: ['Villages'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'region', 'inhabitants', 'coordinates'],
                properties: {
                  $ref: '#/components/schemas/Village',
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Village',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      get: {
        summary: 'Get all villages',
        description: 'Only admins can retrieve all villages.',
        tags: ['Villages'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'query',
            name: 'name',
            schema: {
              type: 'string',
            },
            description: 'Village name',
          },
          {
            in: 'query',
            name: 'region',
            schema: {
              type: 'string',
            },
            description: 'Region ID',
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
            },
            description: 'sort by query in the form of field:desc/asc (ex. name:asc)',
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
            },
            default: 10,
            description: 'Maximum number of villages',
          },
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    results: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Village',
                      },
                    },
                    page: {
                      type: 'integer',
                      example: 1,
                    },
                    limit: {
                      type: 'integer',
                      example: 10,
                    },
                    totalPages: {
                      type: 'integer',
                      example: 1,
                    },
                    totalResults: {
                      type: 'integer',
                      example: 1,
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
        },
      },
    },
    '/villages/{id}': {
      get: {
        summary: 'Get a village',
        description: 'Logged in users can fetch only their own village information.',
        tags: ['Villages'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Village id',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Village',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      patch: {
        summary: 'Update a village',
        description: 'Only admins can update villages.',
        tags: ['Villages'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Village id',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  $ref: '#/components/schemas/Village',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Village',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      delete: {
        summary: 'Delete a village',
        description: 'Only admins can delete villages.',
        tags: ['Villages'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Village id',
          },
        ],
        responses: {
          200: {
            description: 'No content',
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
    },
    '/vehicles': {
      post: {
        summary: 'Create a vehicle',
        description: 'Only admins can create vehicles.',
        tags: ['Vehicles'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['registrationNumber', 'model', 'capacity', 'currentLocation'],
                properties: {
                  $ref: '#/components/schemas/Vehicle',
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Vehicle',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
        },
      },
      get: {
        summary: 'Get all vehicles',
        description: 'All users can retrieve vehicles.',
        tags: ['Vehicles'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'registrationNumber',
            schema: {
              type: 'string',
            },
            description: 'Vehicle registration number',
          },
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['available', 'in-use', 'maintenance'],
            },
            description: 'Vehicle status',
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
            },
            description: 'sort by query in the form of field:desc/asc (ex. registrationNumber:asc)',
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
            },
            default: 10,
            description: 'Maximum number of vehicles',
          },
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    results: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Vehicle',
                      },
                    },
                    page: {
                      type: 'integer',
                      example: 1,
                    },
                    limit: {
                      type: 'integer',
                      example: 10,
                    },
                    totalPages: {
                      type: 'integer',
                      example: 1,
                    },
                    totalResults: {
                      type: 'integer',
                      example: 1,
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
        },
      },
    },
    '/vehicles/{id}': {
      get: {
        summary: 'Get a vehicle',
        description: 'All users can fetch vehicle information.',
        tags: ['Vehicles'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Vehicle id',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Vehicle',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      patch: {
        summary: 'Update a vehicle',
        description: 'Only admins can update vehicles.',
        tags: ['Vehicles'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Vehicle id',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  $ref: '#/components/schemas/Vehicle',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Vehicle',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      delete: {
        summary: 'Delete a vehicle',
        description: 'Only admins can delete vehicles. Fails if vehicle has active driver assignments.',
        tags: ['Vehicles'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Vehicle id',
          },
        ],
        responses: {
          204: {
            description: 'No content',
          },
          400: {
            $ref: '#/components/responses/BadRequest',
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
    },
    '/drivers': {
      post: {
        summary: 'Create a driver',
        description: 'Only admins can create drivers.',
        tags: ['Drivers'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user', 'licenseNumber', 'licenseExpiry'],
                properties: {
                  $ref: '#/components/schemas/Driver',
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Driver',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
        },
      },
      get: {
        summary: 'Get all drivers',
        description: 'All users can retrieve drivers.',
        tags: ['Drivers'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'licenseNumber',
            schema: {
              type: 'string',
            },
            description: 'Driver license number',
          },
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['available', 'on-duty', 'off-duty'],
            },
            description: 'Driver status',
          },
          {
            in: 'query',
            name: 'assignedVehicle',
            schema: {
              type: 'string',
            },
            description: 'Assigned vehicle ID',
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
            },
            description: 'sort by query in the form of field:desc/asc (ex. licenseNumber:asc)',
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
            },
            default: 10,
            description: 'Maximum number of drivers',
          },
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    results: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Driver',
                      },
                    },
                    page: {
                      type: 'integer',
                      example: 1,
                    },
                    limit: {
                      type: 'integer',
                      example: 10,
                    },
                    totalPages: {
                      type: 'integer',
                      example: 1,
                    },
                    totalResults: {
                      type: 'integer',
                      example: 1,
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
        },
      },
    },
    '/drivers/{id}': {
      get: {
        summary: 'Get a driver',
        description: 'All users can fetch driver information.',
        tags: ['Drivers'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Driver id',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Driver',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      patch: {
        summary: 'Update a driver',
        description: 'Only admins can update drivers.',
        tags: ['Drivers'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Driver id',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  $ref: '#/components/schemas/Driver',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Driver',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      delete: {
        summary: 'Delete a driver (soft delete)',
        description: 'Only admins can delete drivers. Unassigns from vehicle if assigned.',
        tags: ['Drivers'],
        security: [{ bearerAuth: [] }],
        responses: {
          204: {
            description: 'No content',
          },
          400: {
            $ref: '#/components/responses/BadRequest',
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
    },
    '/products': {
      post: {
        summary: 'Create a product',
        description: 'Only admins can create products.',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'unit', 'unitPrice', 'currentStock'],
                properties: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
        },
      },
      get: {
        summary: 'Get all products',
        description: 'All users can retrieve products.',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'name',
            schema: {
              type: 'string',
            },
            description: 'Product name',
          },
          {
            in: 'query',
            name: 'unit',
            schema: {
              type: 'string',
            },
            description: 'Product unit',
          },
          {
            in: 'query',
            name: 'vehicle',
            schema: {
              type: 'string',
            },
            description: 'Vehicle ID carrying the product',
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
            },
            description: 'sort by query in the form of field:desc/asc (ex. name:asc)',
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
            },
            default: 10,
            description: 'Maximum number of products',
          },
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    results: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Product',
                      },
                    },
                    page: {
                      type: 'integer',
                      example: 1,
                    },
                    limit: {
                      type: 'integer',
                      example: 10,
                    },
                    totalPages: {
                      type: 'integer',
                      example: 1,
                    },
                    totalResults: {
                      type: 'integer',
                      example: 1,
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
        },
      },
    },
    '/products/{id}': {
      get: {
        summary: 'Get a product',
        description: 'All users can fetch product information.',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Product id',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      patch: {
        summary: 'Update a product',
        description: 'Only admins can update products.',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Product id',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      delete: {
        summary: 'Delete a product',
        description: 'Only admins can delete products.',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Product id',
          },
        ],
        responses: {
          200: {
            description: 'No content',
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
    },
    '/trips': {
      post: {
        summary: 'Create a trip',
        description: 'Only admins can create trips.',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NewTrip',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Trip',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
        },
      },
      get: {
        summary: 'Get all trips',
        description: 'Only authenticated users can retrieve trips.',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
            },
            description: 'Trip status',
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
            },
            description: 'Sort by query in the form of field:desc/asc',
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
            },
            description: 'Maximum number of trips',
          },
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    results: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Trip',
                      },
                    },
                    page: {
                      type: 'integer',
                      example: 1,
                    },
                    limit: {
                      type: 'integer',
                      example: 10,
                    },
                    totalPages: {
                      type: 'integer',
                      example: 1,
                    },
                    totalResults: {
                      type: 'integer',
                      example: 1,
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
        },
      },
    },
    '/trips/{tripId}': {
      get: {
        summary: 'Get a trip',
        description: 'Only authenticated users can retrieve trips.',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'tripId',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Trip id',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Trip',
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      patch: {
        summary: 'Update a trip',
        description: 'Only admins can update trips.',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'tripId',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Trip id',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['in_progress', 'completed', 'cancelled'],
                  },
                  notes: {
                    type: 'string',
                  },
                },
                minProperties: 1,
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Trip',
                },
              },
            },
          },
          400: {
            $ref: '#/components/responses/BadRequest',
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      delete: {
        summary: 'Delete a trip',
        description: 'Only admins can delete trips.',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'tripId',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Trip id',
          },
        ],
        responses: {
          204: {
            description: 'No content',
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
    },
    '/trips/{tripId}/destinations/{destinationId}': {
      patch: {
        summary: 'Update trip destination status',
        description: 'Only admins can update trip destination status.',
        tags: ['Trips'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'tripId',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Trip id',
          },
          {
            in: 'path',
            name: 'destinationId',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Destination id',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['pending', 'completed'],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Trip',
                },
              },
            },
          },
          400: {
            $ref: '#/components/responses/BadRequest',
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      NewTrip: {
        type: 'object',
        required: ['vehicle', 'driver', 'startLocation', 'destinations', 'scheduledStart'],
        properties: {
          vehicle: {
            type: 'string',
            description: 'Vehicle ID',
          },
          driver: {
            type: 'string',
            description: 'Driver ID',
          },
          startLocation: {
            $ref: '#/components/schemas/Location',
          },
          destinations: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Destination',
            },
            minItems: 1,
          },
          scheduledStart: {
            type: 'string',
            format: 'date-time',
          },
          notes: {
            type: 'string',
          },
        },
      },
      Trip: {
        allOf: [
          {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              status: {
                type: 'string',
                enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
              },
              actualStart: {
                type: 'string',
                format: 'date-time',
              },
              actualEnd: {
                type: 'string',
                format: 'date-time',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
          {
            $ref: '#/components/schemas/NewTrip',
          },
        ],
      },
      Location: {
        type: 'object',
        required: ['type', 'coordinates', 'address'],
        properties: {
          type: {
            type: 'string',
            enum: ['Point'],
            default: 'Point',
          },
          coordinates: {
            type: 'array',
            items: {
              type: 'number',
            },
            minItems: 2,
            maxItems: 2,
          },
          address: {
            $ref: '#/components/schemas/Address',
          },
        },
      },
      Address: {
        type: 'object',
        required: ['street', 'city', 'postalCode'],
        properties: {
          street: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          postalCode: {
            type: 'string',
          },
          country: {
            type: 'string',
            default: 'Germany',
          },
        },
      },
      Destination: {
        type: 'object',
        required: ['location', 'village', 'products', 'estimatedArrival'],
        properties: {
          location: {
            $ref: '#/components/schemas/Location',
          },
          village: {
            type: 'string',
            description: 'Village ID',
          },
          products: {
            type: 'array',
            items: {
              type: 'object',
              required: ['product', 'quantity'],
              properties: {
                product: {
                  type: 'string',
                  description: 'Product ID',
                },
                quantity: {
                  type: 'integer',
                  minimum: 1,
                },
              },
            },
            minItems: 1,
          },
          estimatedArrival: {
            type: 'string',
            format: 'date-time',
          },
          actualArrival: {
            type: 'string',
            format: 'date-time',
          },
          status: {
            type: 'string',
            enum: ['pending', 'completed'],
            default: 'pending',
          },
        },
      },
    },
  },
};

module.exports = swaggerDef;
