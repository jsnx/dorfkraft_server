const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const { seedDatabase } = require('./seeders');
const logger = require('./config/logger');

let server;

async function initializeApp() {
  try {
    // First connect to MongoDB
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Then seed if needed
    if (process.env.SEED_TESTDATA === 'true') {
      logger.info('Seeding test data...');
      await seedDatabase();
      logger.info('Test data seeded successfully');
    }

    // Finally start the server
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

initializeApp();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
