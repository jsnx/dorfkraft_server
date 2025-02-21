const healthCheck = (req, res) => {
    res.status(200).send({
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime(),
    });
  };
  
  module.exports = {
    healthCheck,
  };