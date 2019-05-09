const fetch = require('node-fetch');
const retry = require('async-retry');

const config = require(__base + 'config/index');

const RetryRetries = 3;

/**
 * Get a Pool on Toloka
 * @param {{}} pool
 */
const getPool = async (pool, sandbox) => retry(async () => {
    let baseUrl = sandbox ? config.toloka.sandboxEndpoint: config.toloka.baseEndpoint;
    let url = baseUrl + 'pools/' + pool.id;

    let res = await fetch(url, {
        method: 'get',
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken
        }
    });

    if (res.status !== 200)
        throw new Error('Toloka Error: Not able to get the Pool!');

    let json = await res.json();
    return json;
}, { retries: RetryRetries });

/**
 * Get the responses of a Pool on Toloka
 * @param {{}} pool
 */
const getPoolResponses = async (pool, sandbox) => retry(async () => {
    let baseUrl = sandbox ? config.toloka.sandboxEndpoint: config.toloka.baseEndpoint;
    let url = baseUrl + 'assignments?pool_id=' + pool.id;

    let res = await fetch(url, {
        method: 'get',
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken
        }
    });

    if (res.status !== 200)
        throw new Error('Toloka Error: Not able to get the responses of the Pool!');

    let json = await res.json();
    return json;
}, { retries: RetryRetries });

/**
 * Close a Pool on Toloka
 * @param {{}} pool
 */
const closePool = async (pool, sandbox) => retry(async () => {
    let baseUrl = sandbox ? config.toloka.sandboxEndpoint: config.toloka.baseEndpoint;
    let url = baseUrl + `pools/${pool.id}/close`;

    let res = await fetch(url, {
        method: 'post',
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken
        }
    });

    if (res.status !== 204)
        throw new Error('Toloka Error: Not able to close the Pool!');
}, { retries: RetryRetries });


module.exports = { getPool, getPoolResponses, closePool };