const { getPoolResponses, closePool } = require('./toloka-api');

const sleep = require(__base + 'utils/utils').sleep;

const wait = async (blockData, input) => {
    let result;
    let pool = input.taskPool;
    let pEnded, pClosed, crashed = true;
    while (crashed) {
        await sleep(1000 * 20);
        try {
            if (!pEnded)
                await checkFinished(pool);
            pEnded = true;

            if (!pClosed)
                await closePool(pool);
            pClosed = true;

            result = (await getPoolResponses(pool)).items;

            crashed = false;
        }
        catch (err) {
            console.log(err);
            crashed = true;
        }
    }

    return result;
};

const checkFinished = async (pool) => {
    let results = await getPoolResponses(pool);

    let num_answer = 1; //TODO: change

    if (results.items.length < num_answer)
        throw Error("Pool not finished!");
};

module.exports = wait;