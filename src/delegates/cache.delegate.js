const cacheDao = require(__base + 'dao/cache.dao');
const errHandler = require(__base + 'utils/errors');
const runsDelegate = require('./runs.delegate');

const create = async (cache) => {
    check(cache);
    let newCache = await cacheDao.create(cache);
    return newCache;
};

const get = async (cacheId, userId) => {
    cacheId = parseInt(cacheId);
    if (typeof cacheId != "number" || isNaN(cacheId)) {
        throw errHandler.createBusinessError('Cache id is of an invalid type!');
    }

    if (userId !== undefined)
        await userHasAccess(userId, cacheId);

    let cache = await cacheDao.get(cacheId);

    if (!cache)
        throw errHandler.createBusinessNotFoundError('Cache id does not exist!');

    return cache;
};

const deleteCache = async (cacheId, userId) => {
    cacheId = parseInt(cacheId);
    if (typeof cacheId != "number" || isNaN(cacheId)) {
        throw errHandler.createBusinessError('Cache id is of an invalid type!');
    }

    await userHasAccess(userId, cacheId);

    let cache = await cacheDao.deleteCache(cacheId);

    if (!cache)
        throw errHandler.createBusinessNotFoundError('Cache id does not exist!');

    return cache;
};

const update = async (cache, cacheId) => {
    cacheId = parseInt(cacheId);
    if (typeof cacheId != "number" || isNaN(cacheId)) {
        throw errHandler.createBusinessError('Cache id is of an invalid type!');
    }

    cache.id = cacheId;

    check(cache);

    cache = await cacheDao.update(cache);

    if (!cache)
        throw errHandler.createBusinessNotFoundError('Cache id does not exist!');

    return cache;
};

const getAll = async (runId, userId) => {
    runId = parseInt(runId);
    if (typeof runId != "number" || isNaN(runId)) {
        runId = undefined;
    }

    return await cacheDao.getAll(runId, userId);
};

const check = (cache) => {
    if (typeof cache.id_run !== "number")
        throw errHandler.createBusinessError('Cache: id_run is not valid!');
    if (!(cache.data.constructor === Object))
        throw errHandler.createBusinessError('Cache: data is not valid!');
}

const userHasAccess = async (userId, cacheId) => {
    let cache = await cacheDao.get(cacheId);

    await runsDelegate.userHasAccess(userId, cache.id_run);
};

module.exports = {
    create,
    get,
    getAll,
    deleteCache,
    update,
    userHasAccess
};