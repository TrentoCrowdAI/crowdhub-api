const cacheDao = require(__base + 'dao/cache.dao');
const errHandler = require(__base + 'utils/errors');

const create = async (cache) => {
    check(cache);
    let newCache = await cacheDao.create(cache);
    return newCache;
};

const get = async (cacheId) => {
    cacheId = parseInt(cacheId);
    if (typeof cacheId != "number" || isNaN(cacheId)) {
        throw errHandler.createBusinessError('Cache id is of an invalid type!');
    }

    let cache = await cacheDao.get(cacheId);

    if (!cache)
        throw errHandler.createBusinessNotFoundError('Cache id does not exist!');

    return cache;
};

const deleteCache = async (cacheId) => {
    cacheId = parseInt(cacheId);
    if (typeof cacheId != "number" || isNaN(cacheId)) {
        throw errHandler.createBusinessError('Cache id is of an invalid type!');
    }

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

const getAll = async (runId) => {
    runId = parseInt(runId);
    if (typeof runId != "number" || isNaN(runId)) {
        runId = undefined;
    }

    return await cacheDao.getAll(runId);
};

const check = (cache) => {
    if (typeof cache.id_run !== "number")
        throw errHandler.createBusinessNotFoundError('Cache: id_run is not valid!');
    if (!(cache.data.constructor === Object))
        throw errHandler.createBusinessNotFoundError('Cache: data is not valid!');
}

module.exports = {
    create,
    get,
    getAll,
    deleteCache,
    update
};