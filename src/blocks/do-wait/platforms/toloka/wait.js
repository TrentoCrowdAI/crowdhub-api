const { getPool, getPoolResponses, closePool } = require('./toloka-api');

const sleep = require(__base + 'utils/utils').sleep;

const wait = async (blockData, input) => {
    let result;
    let pool = input.taskPool;
    let pEnded, crashed = true;
    while (crashed) {
        await sleep(1000 * 20);
        try {
            if (!pEnded)
                await checkFinished(pool, blockData.sandbox);
            pEnded = true;

            result = (await getPoolResponses(pool, blockData.sandbox)).items;

            crashed = false;
        }
        catch (err) {
            crashed = true;
        }
    }

    return result;
};

const checkFinished = async (pool, sandbox) => {
    pool = await getPool(pool, sandbox);

    if (pool.status !== 'CLOSED') // && pool.last_close_reason !== 'COMPLETED'
        throw Error("Pool not finished!");
};

module.exports = wait;