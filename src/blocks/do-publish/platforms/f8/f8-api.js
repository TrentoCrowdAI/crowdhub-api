const fetch = require('node-fetch');
const querystring = require('querystring');
const retry = require('async-retry');

const config = require(__base + 'config/index');

const RetryRetries = 5;

/**
 * Create a new job on F8 from a template-do object
 * @param {{}} template_do
 */
const createNewJob = async (template_do) => retry(async () => {
    let url = config.f8.baseEndpoint + 'jobs.json?key=' + config.f8.apiKey;

    let newJob = {
        'job[title]': template_do.name,
        'job[instructions]': template_do.instructions
    };
    let body = querystring.stringify(newJob);

    let res = await fetch(url, {
        method: 'post',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to create a new Job!');

    let json = await res.json();
    return json;
}, { retries: RetryRetries });

/**
 * Add some items to an existing F8 job
 * @param {{}} job 
 * @param {[]} items
 */
const addItems = async (job, items) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${job.id}/upload.json?key=${config.f8.apiKey}&force=true`;

    let res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: items
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to add items to the Job!');

    let json = await res.json();
    return json;
}, { retries: RetryRetries });

/**
 * Update the Markup of an existing F8 job
 * @param {{}} job 
 * @param {{}} design 
 */
const updateJobMarkup = async (job, design) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${job.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[cml]': design.markup
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to update the Markup of the Job!');

    let json = await res.json();
    return json;
}, { retries: RetryRetries });

/**
 * Update the JS of an existing F8 job
 * @param {{}} job 
 * @param {{}} design 
 */
const updateJobJS = async (job, design) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${job.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[js]': design.javascript
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to update the JS of the Job!');

    let json = await res.json();
    return json;
}, { retries: RetryRetries });

/**
 * Update the CSS of an existing F8 job
 * @param {{}} job 
 * @param {{}} design 
 */
const updateJobCSS = async (job, design) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${job.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[css]': design.css
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to update the CSS of the Job!');

    let json = await res.json();
    return json;
}, { retries: RetryRetries });

/**
 * Update the job reward, maxVotes, numVotes and units per assignment on an existing F8 job
 * @param {{}} job 
 * @param {{}} blockData
 */
const updateJobSpec = async (job, blockData) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${job.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[payment_cents]': blockData.reward,
        'job[max_judgments_per_worker]': blockData.maxVotes,
        'job[judgments_per_unit]': blockData.numVotes,
        'job[units_per_assignment]': job.units_count
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to update the payment specific of the Job!');

    let json = await res.json();
    return json;
}, { retries: RetryRetries });

/**
 * Convert the loaded Gold items of an existing job into test questions
 * @param {{}} job 
 */
const convertGoldQuestions = async (job) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${job.id}/gold.json?key=${config.f8.apiKey}`;
    let res = await fetch(url, {
        method: 'PUT'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to convert the Gold Questions of the Job!');
}, { retries: RetryRetries });

/**
 * Start an existing F8 job
 * @param {{}} job 
 * @param {boolean} internal
 */
const startJob = async (job, internal) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${job.id}/orders.json?key=${config.f8.apiKey}`;

    let channel = internal ? 'cf_internal' : 'on_demand';

    let data = {
        'channels[0]': channel,
        'debit[units_count]': '100' //TODO: change
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to start the Job!');

    let json = await res.json();

    job.start = json;

    return job;
}, { retries: RetryRetries });

/**
 * Cancel an existing F8 job
 * @param {number} jobId 
 */
const cancelJob = async (jobId) => retry(async () => {
    let url = config.f8.baseEndpoint + `jobs/${jobId}/cancel.json?key=${config.f8.apiKey}`;

    let res = await fetch(url, {
        method: 'GET'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to cancel the Job!');
}, { retries: RetryRetries });

module.exports = {
    createNewJob,
    addItems,
    updateJobMarkup,
    updateJobJS,
    updateJobCSS,
    updateJobSpec,
    convertGoldQuestions,
    startJob,
    cancelJob
};