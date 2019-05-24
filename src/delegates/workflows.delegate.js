const workflowsDao = require(__base + 'dao/workflows.dao');
const errHandler = require(__base + 'utils/errors');
const itemsDelegate = require('./items.delegate');
const tolokaApi = require(__base + 'platform-api/toloka');
const tolokaRender = require(__base + 'blocks/do-publish/platforms/toloka/render');
const workflowsGraph = require('./workflow-graph.delegate');

const { userHasAccessProject, userHasAccessWorkflow } = require('./user-access.delegate');

const create = async (workflow, userId) => {
    check(workflow);
    await userHasAccessProject(userId, workflow.id_project);
    let newWork = await workflowsDao.create(workflow);
    return newWork;
};

const get = async (workId, userId) => {
    workId = parseInt(workId);
    if (typeof workId != "number" || isNaN(workId)) {
        throw errHandler.createBusinessError('Workflow id is of an invalid type!');
    }

    if (userId !== undefined) //let the method be accessible from other functions inside lib which haven't authentication
        await userHasAccessWorkflow(userId, workId);

    let workflow = await workflowsDao.get(workId);

    if (!workflow)
        throw errHandler.createBusinessNotFoundError('Workflow id does not exist!');

    return workflow;
};

const deleteWorkflow = async (workId, userId) => {
    workId = parseInt(workId);
    if (typeof workId != "number" || isNaN(workId)) {
        throw errHandler.createBusinessError('Workflow id is of an invalid type!');
    }

    await userHasAccessWorkflow(userId, workId);
    let workflow = await workflowsDao.deleteWorkflow(workId);

    if (!workflow)
        throw errHandler.createBusinessNotFoundError('Workflow id does not exist!');

    return workflow;
};

const update = async (workflow, workId, userId) => {
    workId = parseInt(workId);
    if (typeof workId != "number" || isNaN(workId)) {
        throw errHandler.createBusinessError('Workflow id is of an invalid type!');
    }

    workflow.id = workId;

    check(workflow);

    await userHasAccessWorkflow(userId, workId);
    workflow = await workflowsDao.update(workflow);

    if (!workflow)
        throw errHandler.createBusinessNotFoundError('Workflow id does not exist!');

    return workflow;
};

const getAll = async (projectId, userId) => {
    return await workflowsDao.getAll(projectId, userId);
};

const start = async (workId, userId) => {
    await userHasAccessWorkflow(userId, workId);
    let workflow = await get(workId);

    const workflowExecutor = require('./workflow-executor.delegate'); // imported here to avoid cycle require
    return await workflowExecutor.start(workflow);
};

const getLastBlocks = async (workId) => {
    let workflow = await get(workId);

    return workflowsGraph.getLastBlocks(workflow);
};

const estimateDoBlockCost = async (workId, blockId, userId) => {
    await userHasAccessWorkflow(userId, workId);
    //retrieve the block
    let workflow = await get(workId);
    let block = workflow.data.graph.nodes.find(b => b.id === blockId);

    //check if block is a do-block
    if (block.type !== 'do')
        throw errHandler.createBusinessError('The specified block is not a Do block!');

    let items = await itemsDelegate.getAll(workflow.id_project);

    //check the platform
    if (block.parameters.platform === 'f8')
        return estimateF8Cost(block, items);
    else if (block.parameters.platform === 'toloka')
        return await estimateTolokaCost(block, items);
};

const estimateF8Cost = (block, items) => {
    let pricePerPage = 1.2 * block.parameters.reward;
    let judgementsPerRow = block.parameters.numVotes;
    let numPages = Math.ceil(items.length / block.parameters.taskPerPage);

    return (judgementsPerRow * numPages * pricePerPage);
};

const estimateTolokaCost = async (block, items) => {
    let design = tolokaRender(block.parameters.jobDesign.blocks);
    let project = await tolokaApi.createProject(block.parameters, design, block.parameters.sandbox);

    project.taskPool = await tolokaApi.createTaskPool(block.parameters, project, block.parameters.sandbox);

    //remap items
    let input = items.map(x => x.data);
    let tasks = await tolokaApi.itemsToTasks(project.taskPool, input, design, block.parameters.sandbox);

    project.tasks = await tolokaApi.createTasks(tasks, block.parameters.sandbox);

    return await tolokaApi.estimatePoolCost(project.taskPool.id, block.parameters.sandbox);
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
    start,
    getLastBlocks,
    estimateDoBlockCost
};