const workflowsDao = require(__base + 'dao/workflows.dao');
const errHandler = require(__base + 'utils/errors');
const workflowExecutor = require('./workflow-executor.delegate');

const create = async (workflow) => {
    check(workflow);
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

    check(workflow);

    workflow = await workflowsDao.update(workflow);

    if (!workflow)
        throw errHandler.createBusinessNotFoundError('Workflow id does not exist!');

    return workflow;
};

const getAll = async (projectId) => {
    return await workflowsDao.getAll(projectId);
};

const start = async (workId) => {
    let workflow = await get(workId);

    return await workflowExecutor(workflow);
};

const check = (workflow) => {
    if (typeof workflow.id_project !== "number")
        throw errHandler.createBusinessError('Workflow: id_project is not valid!');
    if (!(workflow.data.constructor === Object))
        throw errHandler.createBusinessError('Workflow: data is not valid!');
    if (typeof workflow.data.name !== "string")
        throw errHandler.createBusinessError('Workflow: name is not valid!');
}

module.exports = {
    create,
    get,
    getAll,
    deleteWorkflow,
    update,
    start
};