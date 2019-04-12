// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectsDao = require(__base + 'integration/dao/projects.dao');
const errHandler = require(__base + 'utils/errors');

const f8 = require(__base + 'integration/platforms/f8');
const toloka = require(__base + 'integration/platforms/toloka');

const checkJob = require('./jobValidator.delegate');

const publish = async (job, platform) => {
  checkJob(job);

  if (platform === undefined) {
    throw errHandler.createBusinessError('Platform not defined!');
  }

  try {
    if (platform == 'F8') {
      //f8 publishing
      job = await f8.publish(job);
    }
    else if (platform == 'Toloka') {
      //toloka publishing
      job = await toloka.publish(job);
    }
    else if (platform == 'MTurk') {
      //TODO

    }
    else {
      throw new Error('Invalid platform!');
    }

    //update job with platform info
    job = await jobsDao.updateJob(job);
  }
  catch (e) {
    throw errHandler.createBusinessError(e.message);
  }

  return job;
};

const create = async (project) => {
  let newProj = await projectsDao.create(project);
  return newProj;
};

const get = async (projId) => {
  projId = parseInt(projId);
  if (typeof projId != "number" || isNaN(projId)) {
    throw errHandler.createBusinessError('Project id is of an invalid type!');
  }

  let proj = await projectsDao.get(projId);

  if (!proj)
    throw errHandler.createBusinessNotFoundError('Project id does not exist!');

  return proj;
};

const deleteProject = async (projId) => {
  projId = parseInt(projId);
  if (typeof projId != "number" || isNaN(projId)) {
    throw errHandler.createBusinessError('Project id is of an invalid type!');
  }

  let proj = await projectsDao.deleteProject(projId);

  if (!proj)
    throw errHandler.createBusinessNotFoundError('Project id does not exist!');

  return proj;
};

const update = async (proj, projId) => {
  projId = parseInt(projId);
  if (typeof projId != "number" || isNaN(projId)) {
    throw errHandler.createBusinessError('Project id is of an invalid type!');
  }

  proj.id = projId;

  proj = await projectsDao.update(proj);

  if (!proj)
    throw errHandler.createBusinessNotFoundError('Project id does not exist!');

  return proj;
};


const getAll = async () => {
  return await projectsDao.getAll();
};

module.exports = {
  publish,
  create,
  get,
  getAll,
  deleteProject,
  update
};