const runsDao = require(__base + 'dao/runs.dao');
const errHandler = require(__base + 'utils/errors');

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
    update
};