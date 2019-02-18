global.__base = __dirname;

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// health check (public endpoint)
app.get('/', (req, res) => {
  res.json({ msg: 'Hello world!' });
});

module.exports = app;
