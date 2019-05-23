global.__base = __dirname + '/';

const express = require('express');
const bodyParser = require('body-parser');
const Boom = require('boom');
const cors = require('cors');

const errorsHelper = require('./utils/errors');

const projectsController = require('./controllers/projects.controller');
const workflowsController = require('./controllers/workflows.controller');
const templateDoController = require('./controllers/template-do.controller');
const runsController = require('./controllers/runs.controller');
const cacheController = require('./controllers/cache.controller');
const itemsController = require('./controllers/items.controller');
const blockTypesController = require('./controllers/block-types.controller');
const workerOfWorkflowsController = require('./controllers/worker-of-workflows.controller');
const accountBalanceController = require('./controllers/account-balance.controller');



const authentication = require('./authentication/authentication');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// health check (public endpoint)
app.get('/', (req, res) => {
  res.json({ msg: 'Hello world!' });
});

//define authentication middleware
app.use(authentication);

// define authenticated routes here
app.use(projectsController);
app.use(workflowsController);
app.use(templateDoController);
app.use(runsController);
app.use(cacheController);
app.use(itemsController);
app.use(blockTypesController);
app.use(workerOfWorkflowsController);
app.use(accountBalanceController);


app.use((e, req, res, next) => {
  console.error('[Error]', e);
  let error = errorsHelper.createServiceError(e);


  if (error.status === 401 && !error.isBoom) {
    const message = 'Not authorized to perform the request';
    error = Boom.unauthorized(message);
  }

  if (!error.isBoom) {
    error = Boom.badImplementation();
  }
  res.status(error.output.statusCode).send(error.output);
});
module.exports = app;
