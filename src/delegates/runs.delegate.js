const runsDao = require(__base + 'dao/runs.dao');
const errHandler = require(__base + 'utils/errors');

let workflowsDelegate = require('./workflows.delegate');
const cacheDelegate = require('./cache.delegate');

const create = async (run) => {
    check(run);
    let newRun = await runsDao.create(run);
    return newRun;
};

const get = async (runId) => {
    runId = parseInt(runId);
    if (typeof runId != "number" || isNaN(runId)) {
        throw errHandler.createBusinessError('Run id is of an invalid type!');
    }

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

const getAll = async (workflowId) => {
    workflowId = parseInt(workflowId);
    if (typeof workflowId != "number" || isNaN(workflowId)) {
        workflowId = undefined;
    }

    return await runsDao.getAll(workflowId);
};

const getResult = async (runId) => {
    let run = await get(runId);

    //get graph's nodes without children
    workflowsDelegate = require('./workflows.delegate'); //don't know why but node rewrites the object to an empty one
    let lastBlocks = await workflowsDelegate.getLastBlocks(run.id_workflow);

    //get results of them
    let result = {};
    for (let block of lastBlocks) {
        console.log(run.data[block.id].state );
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