module.exports = {
  aws: {
    clientId: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGIONAWS_REGION,
    endpoint: process.env.AWS_ENDPOINT
  },
  db: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    // heroku postgres adds automatically the following variable.
    url: process.env.DATABASE_URL
  }
};
