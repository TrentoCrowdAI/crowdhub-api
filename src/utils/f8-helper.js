const fetch = require('node-fetch');
const querystring = require('querystring');
const retry = require('async-retry');

const config = require(__base + 'config/index');

const RetryRetries = 5;

const cancelJob = async (jobId) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${jobId}/cancel.json?key=${config.f8.apiKey}`;

    let res = await fetch(url, {
        method: 'GET'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to cancel the Job!');
}, { retries: RetryRetries });

const getAllRows = async (jobId) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${jobId}/units.json?key=${config.f8.apiKey}`;

    let res = await fetch(url, {
        method: 'GET'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to get the units of thes Job!');

    return await res.json();
}, { retries: RetryRetries });

const finalizeRow = async (jobId, rowId) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${jobId}/units/${rowId}.json?key=${config.f8.apiKey}`;

    let row = {
        'unit[state]': 'finalized'
    };
    let body = querystring.stringify(row);
    let res = await fetch(url, {
        method: 'PUT',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to finalize the row of the Job!');
}, { retries: RetryRetries });

const finalizeAllRows = async (jobId) => retry(async () => {
    let rows = await getAllRows(jobId);

    for (let row of Object.keys(rows)) {
        await finalizeRow(jobId, row);
    }
}, { retries: RetryRetries });



module.exports = {
    cancelJob,
    finalizeAllRows
};