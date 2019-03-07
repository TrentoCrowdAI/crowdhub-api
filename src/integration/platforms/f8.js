const fetch = require('node-fetch');
const querystring = require('querystring');

const config = require(__base + 'config/index');

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

    console.log(job);

    return job;
};

const createNewJob = async (job) => {
    let url = config.f8.baseEndpoint + 'jobs.json?key=' + config.f8.apiKey;

    //TODO: add more info
    let newJob = {
        'job[title]': job.data.name
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

const updateJobInfo = async (job) => {
    //TODO
};

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

const convertGoldQuestions = async (job) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}/gold.json?key=${config.f8.apiKey}`;
    await fetch(url, {
        method: 'PUT'
    });
};

module.exports = {
    publish
};