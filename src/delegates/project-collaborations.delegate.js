const collaborationsDao = require(__base + 'dao/project-collaborations.dao');
const errHandler = require(__base + 'utils/errors');

const { userHasAccessCollaboration, userHasAccessProject } = require('./user-access.delegate');

const create = async (userId, projectId, userAuthId) => {
    if (userId === undefined) {
        throw errHandler.createBusinessError('User id is not set!');
    }
    projectId = parseInt(projectId);
    if (typeof projectId != "number" || isNaN(projectId)) {
        throw errHandler.createBusinessError('Project id is of an invalid type!');
    }

    await userHasAccessProject(userAuthId, projectId);

    let newCollab = await collaborationsDao.create(userId, projectId);
    return newCollab;
};

const get = async (collabId, userId) => {
    collabId = parseInt(collabId);
    if (typeof collabId != "number" || isNaN(collabId)) {
        throw errHandler.createBusinessError('Project-collaboration id is of an invalid type!');
    }

    await userHasAccessCollaboration(userId, collabId);

    let collab = await collaborationsDao.get(collabId);

    if (!collab)
        throw errHandler.createBusinessNotFoundError('Project-collaboration id does not exist!');

    return collab;
};

const deleteCollaboration = async (collabId, userId) => {
    collabId = parseInt(collabId);
    if (typeof collabId != "number" || isNaN(collabId)) {
        throw errHandler.createBusinessError('Project-collaboration id is of an invalid type!');
    }

    await userHasAccessCollaboration(userId, collabId);

    let collab = await collaborationsDao.deleteCollaboration(collabId);

    if (!collab)
        throw errHandler.createBusinessNotFoundError('Project-collaboration id does not exist!');

    return collab;
};

const getAllByProject = async (projectId, userId) => {
    projectId = parseInt(projectId);
    if (typeof projectId != "number" || isNaN(projectId)) {
        throw errHandler.createBusinessError('Project id is of an invalid type!');
    }

    await userHasAccessProject(userId, projectId);

    return await collaborationsDao.getAllByProject(projectId);
};

module.exports = {
    create,
    get,
    getAllByProject,
    deleteCollaboration
};