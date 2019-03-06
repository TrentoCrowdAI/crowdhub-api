const fetch = require('node-fetch');
const config = require(__base + 'config/index');

const publish = async (job) => {
    job = await createNewJob(job);
    console.log(job);

    return job;
};

const createNewJob = async (job) => {
    let url = config.f8.baseEndpoint + 'jobs.json?key=' + config.f8.apiKey;
    let body = 'job[title]=' + job.data.name;

    let res = await fetch(url, {
        method: 'post',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    let json = await res.json();

    job.data.platform.f8 = json;
    
    return job;
};

const addCsvItems = async (job) => {
    let itemsCsv;
    let goldItemsCsv;

    fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'text/csv' },
    })
        .then(res => res.json())
        .then(json => console.log(json));
};

const updateJobInfo = async (job) => {
    //TODO
};

const updateJobCML = async (job) => {
    //TODO
};

module.exports = {
    publish
};