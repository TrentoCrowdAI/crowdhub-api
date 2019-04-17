const fetch = require('node-fetch');
const querystring = require('querystring');

const config = require(__base + 'config/index');

/**
 * Create a new job on F8
 * @param {{}} job
 */
const createNewJob = async (job) => {
    let url = config.f8.baseEndpoint + 'jobs.json?key=' + config.f8.apiKey;

    let newJob = {
        'job[title]': job.data.name,
        'job[instructions]': job.data.instructions
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

    if (job.data.platform === undefined)
        job.data.platform = {};

    job.data.platform.f8 = json;

    return job;
};

/**
 * Add some items to an existing F8 job using a CSV file
 * @param {{}} job 
 * @param {string} csvFile URL to the CSV file
 */
const addCsvItems = async (job, csvFile) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}/upload.json?key=${config.f8.apiKey}&force=true`;

    let csvReq = await fetch(csvFile);
    let csvData = await csvReq.text();

    let res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/csv'
        },
        body: csvData
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to add CSV items to the Job!');

    let json = await res.json();
    job.data.platform.f8 = json;

    return job;
};

/**
 * Update the Markup of an existing F8 job
 * @param {{}} job 
 */
const updateJobMarkup = async (job, design) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}.json?key=${config.f8.apiKey}`;

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
    job.data.platform.f8 = json;

    return job;
};

/**
 * Update the JS of an existing F8 job
 * @param {{}} job 
 */
const updateJobJS = async (job, design) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}.json?key=${config.f8.apiKey}`;

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
    job.data.platform.f8 = json;

    return job;
};

/**
 * Update the CSS of an existing F8 job
 * @param {{}} job 
 */
const updateJobCSS = async (job, design) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}.json?key=${config.f8.apiKey}`;

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
    job.data.platform.f8 = json;

    return job;
};

/**
 * Update the job reward, maxVotes and numVotes on an existing F8 job
 * @param {{}} job 
 */
const updateJobSpec = async (job) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[payment_cents]': job.data.reward,
        'job[max_judgments_per_worker]': job.data.maxVotes,
        'job[judgments_per_unit]': job.data.numVotes
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
    job.data.platform.f8 = json;

    return job;
};

/**
 * Convert the loaded Gold items of an existing job into test questions
 * @param {{}} job 
 */
const convertGoldQuestions = async (job) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}/gold.json?key=${config.f8.apiKey}`;
    let res = await fetch(url, {
        method: 'PUT'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to convert the Gold Questions of the Job!');
};

module.exports = {
    createNewJob,
    addCsvItems,
    updateJobMarkup,
    updateJobJS,
    updateJobCSS,
    updateJobSpec,
    convertGoldQuestions
};