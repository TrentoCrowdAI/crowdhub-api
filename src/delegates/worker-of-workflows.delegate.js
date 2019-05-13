const workerOfWorkflowsDao = require(__base + 'dao/worker-of-workflows.dao');
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

const elaborateWorker = async (platform, task_id, worker_id) => {
    //find the workflow from the task_id
    let workflow_id;
    if (platform === 'f8') {
        workflow_id = await workerOfWorkflowsDao.getWorkflowFromTaskId(task_id);
    } else if (platform === 'toloka') {

    }
    else {
        throw errHandler.createBusinessError('The platform is not supported!');
    }

    //try to store the data
    try {
        let item = { id_workflow: workflow_id, id_worker: worker_id, data: { platform: platform } };
        item = await create(item);
        return { response: "OK" };
    } catch (e) {
        //return error, block user from answering the task
        return { response: "BLOCKED" };
    }
};

const check = (item) => {
    if (typeof item.id_workflow !== "number")
        throw errHandler.createBusinessError('Worker-of-workflow: id_workflow is not valid!');
    if (item.id_worker === undefined)
        throw errHandler.createBusinessError('Worker-of-workflow: id_worker is not valid!');
    if (!(item.data.constructor === Object))
        throw errHandler.createBusinessError('Worker-of-workflow: data is not valid!');
}

module.exports = {
    create,
    get,
    deleteWorker,
    elaborateWorker
};