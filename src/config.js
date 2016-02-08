module.exports = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  isProduction: process.env.NODE_ENV !== 'development',
  mongoose: {
    uri: 'mongodb://localhost/db',
  },
};
