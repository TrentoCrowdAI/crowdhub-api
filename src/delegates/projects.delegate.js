const projectsDao = require(__base + 'dao/projects.dao');
const errHandler = require(__base + 'utils/errors');

const create = async (project) => {
  check(project);
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

  check(proj.data);

  proj = await projectsDao.update(proj);

  if (!proj)
    throw errHandler.createBusinessNotFoundError('Project id does not exist!');

  return proj;
};

const getAll = async () => {
  return await projectsDao.getAll();
};

const check = (project) => {
  if (typeof project.name !== "string")
    throw errHandler.createBusinessNotFoundError('Project: name is not valid!');
  if (typeof project.description !== "string")
    throw errHandler.createBusinessNotFoundError('Project: description is not valid!');
};

module.exports = {
  update,
  create,
  get,
  getAll,
  deleteProject
};