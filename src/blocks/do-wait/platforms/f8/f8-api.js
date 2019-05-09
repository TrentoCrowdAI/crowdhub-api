const fetch = require('node-fetch');
const querystring = require('querystring');
const retry = require('async-retry');

const config = require(__base + 'config/index');

const RetryRetries = 2;

/**
 * Ping an existing F8 job
 * @param {number} jobId 
 */
const getJob = async (jobId) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${jobId}.json?key=${config.f8.apiKey}`;

    let res = await fetch(url, {
        method: 'GET'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to get the Job!');

    let json = await res.json();

    return json;
}, { retries: RetryRetries });

/**
 * Ping an existing F8 job
 * @param {number} jobId 
 */
const pingJob = async (jobId) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${jobId}/ping.json?key=${config.f8.apiKey}`;

    let res = await fetch(url, {
        method: 'GET'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to ping the Job!');

    let json = await res.json();

    return json;
}, { retries: RetryRetries });

/**
 * Ping an existing F8 job
 * @param {number} jobId 
 */
const getJobJudgments = async (jobId) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${jobId}/judgments.json?key=${config.f8.apiKey}`;

    let res = await fetch(url, {
        method: 'GET'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to get the judgments of the Job!');

    let json = await res.json();

    return json;
}, { retries: RetryRetries });

/**
 * Pause an existing F8 job
 * @param {number} jobId 
 */
const pauseJob = async (jobId) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${jobId}/pause.json?key=${config.f8.apiKey}`;

    let res = await fetch(url, {
        method: 'GET'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to pause the Job!');

    let json = await res.json();

    return json;
}, { retries: RetryRetries });

/**
 * Get the generated CSV report of an existing F8 job
 * @param {number} jobId 
 */
const getCsvReport = async (jobId) => retry(async () => {
    let reportType = 'full';
    let url = config.f8.baseEndpoint + `jobs/${jobId}.csv?type=${reportType}&key=${config.f8.apiKey}`;

    let res = await fetch(url, {
        method: 'GET'
    });

    if (res.status === 202)
        throw new Error('F8: Generation of the report for the Job started!');
    else if (res.status !== 200)
        throw new Error('F8 Error: Not able to get the report for the Job!');

    return await res.buffer();
}, { retries: RetryRetries });

module.exports = {
    getJob,
    pingJob,
    pauseJob,
    getCsvReport,
    getJobJudgments
};