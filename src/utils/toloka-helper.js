const fetch = require('node-fetch');
const retry = require('async-retry');

const config = require(__base + 'config/index');

const RetryRetries = 3;

const closePool = async (poolId, sandbox) => retry(async () => {
    let baseUrl = sandbox ? config.toloka.sandboxEndpoint : config.toloka.baseEndpoint;
    let url = baseUrl + 'pools/' + poolId + '/close';

    let res = await fetch(url, {
        method: 'post',
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken
        }
    });

    if (res.status !== 202)
        throw new Error('Toloka Error: Not able to close the Pool!');
}, { retries: RetryRetries });

module.exports = { closePool };