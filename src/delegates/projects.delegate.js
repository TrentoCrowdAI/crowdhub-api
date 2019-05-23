const projectsDao = require(__base + 'dao/projects.dao');
const errHandler = require(__base + 'utils/errors');

const create = async (project, userId) => {
  if (userId === undefined) {
    throw errHandler.createBusinessError('User id is not defined!');
  }
  check(project);
  let newProj = await projectsDao.create(project, userId);
  return newProj;
};

const get = async (projId, userId) => {
  if (userId === undefined) {
    throw errHandler.createBusinessError('User id is not defined!');
  }
  projId = parseInt(projId);
  if (typeof projId != "number" || isNaN(projId)) {
    throw errHandler.createBusinessError('Project id is of an invalid type!');
  }

  await userHasAccess(userId, projId);
  let proj = await projectsDao.get(projId);

  if (!proj)
    throw errHandler.createBusinessNotFoundError('Project id does not exist!');

  return proj;
};

const deleteProject = async (projId, userId) => {
  if (userId === undefined) {
    throw errHandler.createBusinessError('User id is not defined!');
  }
  projId = parseInt(projId);
  if (typeof projId != "number" || isNaN(projId)) {
    throw errHandler.createBusinessError('Project id is of an invalid type!');
  }

  await userHasAccess(userId, projId);
  let proj = await projectsDao.deleteProject(projId);

  if (!proj)
    throw errHandler.createBusinessNotFoundError('Project id does not exist!');

  return proj;
};

const update = async (proj, projId, userId) => {
  if (userId === undefined) {
    throw errHandler.createBusinessError('User id is not defined!');
  }
  projId = parseInt(projId);
  if (typeof projId != "number" || isNaN(projId)) {
    throw errHandler.createBusinessError('Project id is of an invalid type!');
  }

  proj.id = projId;

  check(proj.data);
  await userHasAccess(userId, projId);

  proj = await projectsDao.update(proj);

  if (!proj)
    throw errHandler.createBusinessNotFoundError('Project id does not exist!');

  return proj;
};

const getAll = async (userId) => {
  if (userId === undefined) {
    throw errHandler.createBusinessError('User id is not defined!');
  }
  return await projectsDao.getAll(userId);
};

const check = (project) => {
  if (typeof project.name !== "string")
    throw errHandler.createBusinessError('Project: name is not valid!');
  if (typeof project.description !== "string")
    throw errHandler.createBusinessError('Project: description is not valid!');
};

const userHasAccess = async (userId, projectId) => {
  let check = await projectsDao.userHasAccess(userId, projectId);

  if(check === undefined)
    throw errHandler.createBusinessUnauthorizedError('You are not authorized to access this resource!');
};

module.exports = {
  update,
  create,
  get,
  getAll,
  deleteProject,
  userHasAccess
};