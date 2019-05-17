const workerOfWorkflowsDao = require(__base + 'dao/worker-of-workflows.dao');
const cacheDao = require(__base + 'dao/cache.dao');
const runsDelegate = require(__base + 'delegates/runs.delegate');
const workflowsDelegate = require(__base + 'delegates/workflows.delegate');
const errHandler = require(__base + 'utils/errors');

const create = async (item) => {
    check(item);
    let newItem = await workerOfWorkflowsDao.create(item);
    return newItem;
};

const get = async (itemId) => {
    itemId = parseInt(itemId);
    if (typeof itemId != "number" || isNaN(itemId)) {
        throw errHandler.createBusinessError('The id is of an invalid type!');
    }

    let item = await workerOfWorkflowsDao.get(itemId);

    if (!item)
        throw errHandler.createBusinessNotFoundError('The id does not exist!');

    return item;
};

const deleteWorker = async (itemId) => {
    itemId = parseInt(itemId);
    if (typeof itemId != "number" || isNaN(itemId)) {
        throw errHandler.createBusinessError('The id is of an invalid type!');
    }

    let item = await workerOfWorkflowsDao.deleteWorker(itemId);

    if (!item)
        throw errHandler.createBusinessNotFoundError('The id does not exist!');

    return item;
};

const elaborateWorker = async (platform, job_id, worker_id) => {
    let cache = await getCacheByPlatformAndJobId(platform, job_id);

    let run = await runsDelegate.get(cache.id_run);
    let blockId = getBlockIdByCacheId(run, cache.id);

    let workflow = await workflowsDelegate.get(run.id_workflow);
    let block = workflow.data.graph.nodes.find(block => block.id === blockId);
    let contextId = block.blockingContext;

    //try to store the data
    try {
        if (contextId !== undefined) { //block related to a context
            let item = { id_context: contextId, id_worker: worker_id, id_workflow: workflow.id, data: { platform: platform } };
            item = await create(item);
        }
        return { response: "OK" };
    } catch (e) {
        //return error, block user from answering the task
        return { response: "BLOCKED" };
    }
};

const async getCacheByPlatformAndJobId = (platform, job_id) => {
    let cache;
    if (platform === 'f8') {
        cache = await cacheDao.getCacheFromJobIdF8(job_id);
    } else if (platform === 'toloka') {
        cache = await cacheDao.getCacheFromPoolIdToloka(job_id);
    } else {
        throw errHandler.createBusinessError('The platform is not supported!');
    }
    return cache;
};

const getBlockIdByCacheId = (run, cacheId) =>  Object.keys(run.data)
  .find(blockId => run.data[blockId].state === 'finished' && run.data[blockId].id_cache === cacheId);

const check = (item) => {
    if (item.id_context === undefined)
        throw errHandler.createBusinessError('Worker-of-workflow: id_context is not valid!');
    if (typeof item.id_workflow !== "number")
        throw errHandler.createBusinessError('Worker-of-workflow: id_workflow is not valid!');
    if (item.id_worker === undefined)
        throw errHandler.createBusinessError('Worker-of-workflow: id_worker is not valid!');
    if (!(item.data.constructor === Object))
        throw errHandler.createBusinessError('Worker-of-workflow: data is not valid!');
};

module.exports = {
    create,
    get,
    deleteWorker,
    elaborateWorker
};
