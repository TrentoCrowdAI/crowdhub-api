const fetch = require('node-fetch');
const querystring = require('querystring');

const config = require(__base + 'config/index');

/**
 * Publish the job parameter on the F8 platform as a new job.
 * @param {{}} job 
 */
const publish = async (job) => {
    job = await createNewJob(job);

    //add items
    job = await addCsvItems(job, job.data.items_csv);

    //add gold items
    job = await addCsvItems(job, job.data.items_gold_csv);
    //recognise gold items
    await convertGoldQuestions(job);

    //set the CML of the job
    job = await updateJobCML(job);

    //set the reward info of the job
    job = await updateJobSpec(job);

    return job;
};

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

    let json = await res.json();
    job.data.platform.f8 = json;

    return job;
};

/**
 * Update the CML of an existing F8 job
 * @param {{}} job 
 */
const updateJobCML = async (job) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[cml]': job.data.design
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

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
    await fetch(url, {
        method: 'PUT'
    });
};

module.exports = {
    publish
};