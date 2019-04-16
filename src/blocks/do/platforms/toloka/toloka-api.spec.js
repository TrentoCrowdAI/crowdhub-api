const toloka = require('./toloka');
//const jobsDelegate = require(__base + 'delegates/jobs.delegate');

let example = __base + "../example/";
const rightJob = require(example + 'job-example-text-highlighting.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('Toloka tests', async () => {
    test('Empty', () => {
        expect(true).toBe(true);
    });
    /*
    let job;

    beforeAll(async () => {
        job = await jobsDelegate.createJob(rightJob);
    });

    test('Toloka publish test', async () => {
        let res = await toloka.publish(job);

        expect(res.data.platform.toloka).toBeDefined();
    });

    afterAll(async () => {
        await jobsDelegate.deleteJob(job.id);
    });*/
});