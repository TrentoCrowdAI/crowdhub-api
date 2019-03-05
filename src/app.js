global.__base = __dirname;

const express = require('express');
const bodyParser = require('body-parser');
const Boom = require('boom');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error('Error', error);

  if (error.status === 401 && !error.isBoom) {
    const message = 'Not authorized to perform the request';
    error = Boom.unauthorized(message);
  }
  if (!error.isBoom) {
    error = Boom.badImplementation();
  }
  res.status(error.output.statusCode).send(error.output);
});

// health check (public endpoint)
app.get('/', (req, res) => {
  res.json({ msg: 'Hello world!' });
});

module.exports = app;
