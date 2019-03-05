global.__base = __dirname + '/';

const express = require('express');
const bodyParser = require('body-parser');

const jobs_controller = require('./integration/controllers/jobs.controller');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// health check (public endpoint)
app.get('/', (req, res) => {
  res.json({ msg: 'Hello world!' });
});

app.use(jobs_controller);

module.exports = app;
