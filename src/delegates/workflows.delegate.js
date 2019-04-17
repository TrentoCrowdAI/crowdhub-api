const workflowsDao = require(__base + 'dao/workflows.dao');
const errHandler = require(__base + 'utils/errors');

const create = async (workflow) => {
    let newWork = await workflowsDao.create(workflow);
    return newWork;
};

const get = async (workId) => {
    workId = parseInt(workId);
    if (typeof workId != "number" || isNaN(workId)) {
        throw errHandler.createBusinessError('Workflow id is of an invalid type!');
    }

    let workflow = await workflowsDao.get(workId);

    if (!workflow)
        throw errHandler.createBusinessNotFoundError('Workflow id does not exist!');

    return workflow;
};

const deleteWorkflow = async (workId) => {
    workId = parseInt(workId);
    if (typeof workId != "number" || isNaN(workId)) {
        throw errHandler.createBusinessError('Workflow id is of an invalid type!');
    }

    let workflow = await workflowsDao.deleteWorkflow(workId);

    if (!workflow)
        throw errHandler.createBusinessNotFoundError('Workflow id does not exist!');

    return workflow;
};

const update = async (workflow, workId) => {
    workId = parseInt(workId);
    if (typeof workId != "number" || isNaN(workId)) {
        throw errHandler.createBusinessError('Workflow id is of an invalid type!');
    }

    workflow.id = workId;

    workflow = await workflowsDao.update(workflow);

    if (!workflow)
        throw errHandler.createBusinessNotFoundError('Workflow id does not exist!');

    return workflow;
};

const getAll = async (projectId) => {
    return await workflowsDao.getAll(projectId);
};

const start = async (workId) => {
    throw errHandler.createBusinessError('Workflow start function not implemented yet!');
};

module.exports = {
    create,
    get,
    getAll,
    deleteWorkflow,
    update,
    start
};