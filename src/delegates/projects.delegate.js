const projectsDao = require(__base + 'dao/projects.dao');
const errHandler = require(__base + 'utils/errors');

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
  update,
  create,
  get,
  getAll,
  deleteProject
};