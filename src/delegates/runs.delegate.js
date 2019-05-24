const runsDao = require(__base + 'dao/runs.dao');
const errHandler = require(__base + 'utils/errors');

const cacheDelegate = require('./cache.delegate');
const workflowsDelegate = require('./workflows.delegate');

const { userHasAccessRun } = require('./user-access.delegate');

const create = async (run) => {
    check(run);
    let newRun = await runsDao.create(run);
    return newRun;
};

const get = async (runId, userId) => {
    runId = parseInt(runId);
    if (typeof runId != "number" || isNaN(runId)) {
        throw errHandler.createBusinessError('Run id is of an invalid type!');
    }

    if (userId !== undefined)
        await userHasAccessRun(userId, runId);

    let run = await runsDao.get(runId);

    if (!run)
        throw errHandler.createBusinessNotFoundError('Run id does not exist!');

    return run;
};

const deleteRun = async (runId) => {
    runId = parseInt(runId);
    if (typeof runId != "number" || isNaN(runId)) {
        throw errHandler.createBusinessError('Run id is of an invalid type!');
    }

    let run = await runsDao.deleteRun(runId);

    if (!run)
        throw errHandler.createBusinessNotFoundError('Run id does not exist!');

    return run;
};

const update = async (run, runId) => {
    runId = parseInt(runId);
    if (typeof runId != "number" || isNaN(runId)) {
        throw errHandler.createBusinessError('Run id is of an invalid type!');
    }

    run.id = runId;

    check(run);

    run = await runsDao.update(run);

    if (!run)
        throw errHandler.createBusinessNotFoundError('Run id does not exist!');

    return run;
};

const getAll = async (workflowId, userId) => {
    workflowId = parseInt(workflowId);
    if (typeof workflowId != "number" || isNaN(workflowId)) {
        workflowId = undefined;
    }

    return await runsDao.getAll(workflowId, userId);
};

const getResult = async (runId, userId) => {
    await userHasAccessRun(userId, runId);
    let run = await get(runId);

    //get graph's nodes without children
    let lastBlocks = await workflowsDelegate.getLastBlocks(run.id_workflow);

    //get results of them
    let result = {};
    for (let block of lastBlocks) {
        if (run.data[block.id].state != 'finished')
            throw errHandler.createBusinessError('The run is still in execution!');
        let cacheId = run.data[block.id].id_cache;
        result[block.label] = (await cacheDelegate.get(cacheId)).data.result;
    }

    return result;
};

const check = (run) => {
    if (typeof run.id_workflow !== "number")
        throw errHandler.createBusinessError('Run: id_workflow is not valid!');
    if (!(run.data.constructor === Object))
        throw errHandler.createBusinessError('Run: data is not valid!');
}

module.exports = {
    create,
    get,
    getAll,
    deleteRun,
    update,
    getResult
};