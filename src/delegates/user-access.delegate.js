const projectsDao = require(__base + 'dao/projects.dao');
const itemsDao = require(__base + 'dao/items.dao');
const workflowsDao = require(__base + 'dao/workflows.dao');
const runsDao = require(__base + 'dao/runs.dao');
const cacheDao = require(__base + 'dao/cache.dao');
const collaborationsDao = require(__base + 'dao/project-collaborations.dao');

const userHasAccessProject = async (userId, projectId) => {
    let check = await projectsDao.userHasAccess(userId, projectId);

    if (check === undefined)
        throw errHandler.createBusinessUnauthorizedError('You are not authorized to access this resource!');
};

const userHasAccessItem = async (userId, itemId) => {
    let item = await itemsDao.get(itemId);

    await userHasAccessProject(userId, item.id_project);
};

const userHasAccessWorkflow = async (userId, workflowId) => {
    let workflow = await workflowsDao.get(workflowId);

    await userHasAccessProject(userId, workflow.id_project);
};

const userHasAccessRun = async (userId, runId) => {
    let run = await runsDao.get(runId);

    await userHasAccessWorkflow(userId, run.id_workflow);
};

const userHasAccessCache = async (userId, cacheId) => {
    let cache = await cacheDao.get(cacheId);

    await userHasAccessRun(userId, cache.id_run);
};

const userHasAccessCollaboration = async (userId, collabId) => {
    let collab = await collaborationsDao.get(collabId);

    await userHasAccessProject(userId, collab.id_project);
};

module.exports = {
    userHasAccessProject,
    userHasAccessItem,
    userHasAccessWorkflow,
    userHasAccessRun,
    userHasAccessCache,
    userHasAccessCollaboration
};