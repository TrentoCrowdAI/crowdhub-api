module.exports = {
  aws: {
    clientId: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGIONAWS_REGION,
    endpoint: process.env.AWS_ENDPOINT
  },
  f8: {
    apiKey: process.env.F8_API_KEY,
    baseEndpoint: process.env.F8_BASE_ENDPOINT
  },
  toloka: {
    accessToken: process.env.TOLOKA_ACCESS_TOKEN,
    baseEndpoint: process.env.TOLOKA_BASE_ENDPOINT,
    sandboxEndpoint: process.env.TOLOKA_SANDBOX_ENDPOINT
  },
  db: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    // heroku postgres adds automatically the following variable.
    url: process.env.DATABASE_URL
  },
  googleOauth: {
    clientId: process.env.GOOGLE_CLIENT_ID
  }
};
